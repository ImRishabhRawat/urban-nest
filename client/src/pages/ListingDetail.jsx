import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BASE_URL, token } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Container from "../components/Container";
import ListingHead from "../components/listings/ListingHead";
import ListingInfo from "../components/listings/ListingInfo";
import { categories } from "../components/Header/Categories";
import useLoginModal from "../hooks/useLoginModal";
import { authContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import ListingReservation from "../components/listings/ListingReservation";
import EmptyState from "../components/EmptyState";
import { format } from "date-fns";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingDetail = () => {
  const loginModal = useLoginModal();
  const navigate = useNavigate();
  const { user, role } = useContext(authContext);

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dayCount, setDayCount] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [alreadyScheduled, setAlreadyScheduled] = useState(false);

  useEffect(() => {
    if (listing && listing.price) {
      setTotalPrice(listing.price); // Update totalPrice when listing is loaded and contains price
    }
  }, [listing]);

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/listing/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        },
      );
      setReservations(response.data.data);
      if (
        response.data.data.some(
          (reservation) => reservation.user._id === user._id,
        )
      ) {
        setAlreadyScheduled(true);
      }
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  }, [listingId, user._id]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const disabledDates = useMemo(() => {
    let dates = [];

    reservations.forEach((reservation) => {
      const { startDate, endDate } = reservation.visitDates;

      const range = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const onCreateReservation = useCallback(async () => {
    if (!user || role !== "student") {
      console.log(
        "Opening login modal, user not found or incorrect role",
        user,
      );
      return loginModal.onOpen();
    }
    setIsLoading(true);

    console.log({
      user: user._id,
      owner: listing?.owner?._id,
      room: listing?._id,
      price: totalPrice,
      visitDates: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      },
    });
    try {
      await axios.post(
        `${BASE_URL}/booking/${listingId}`,
        {
          user: user._id,
          price: totalPrice,
          visitDates: {
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString(),
          },
          room: listing?._id,
          owner: listing?.owner?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Visit scheduled successfully.");
      setDateRange(initialDateRange);
      await fetchReservations(); // Fetch reservations again after creating one
      navigate("/booking");
    } catch (error) {
      console.error("Booking failed:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        toast.error(
          `Error: ${error.response.data.message || "Something went wrong"}`,
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  }, [totalPrice, dateRange, listing?._id, navigate, user, loginModal, fetchReservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const count = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate,
      );
      setDayCount(count);
    }
  }, [dateRange]);

  const category = useMemo(() => {
    if (
      listing &&
      Array.isArray(listing.category) &&
      listing.category.length > 0
    ) {
      return categories.find((item) => item.label === listing.category[0]);
    }
    return null;
  }, [listing]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/room/${listingId}`); // Adjust URL as necessary
        setListing(response.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching room data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [listingId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!listing)
    return (
      <EmptyState
        title="No Room"
        subtitle="Looks like This room is not available"
      />
    );

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto ">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.images}
            location={listing.location}
            id={listing._id}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              owner={listing.owner}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              studentCount={listing.studentCount}
              bathroomCount={listing.bathroomCount}
              location={listing.location}
            />
            {role === "student" &&
              (listing.status !== "listed" ? (
                <div className="order-first mb-10 md:order-last md:col-span-3">
                  <ListingReservation
                    price={totalPrice}
                    onChangeDate={(value) => setDateRange(value)}
                    dateRange={dateRange}
                    onSubmit={onCreateReservation}
                    disabled={isLoading}
                    disabledDates={disabledDates}
                    dayCount={dayCount}
                    alreadyScheduled={alreadyScheduled}
                  />
                </div>
              ) : (
                <div className="order-first mb-10 md:order-last md:col-span-3">
                    { user?._id === reservations[0]?.user?._id ? (
                      <p className="text-lg font-semibold text-red-500">
                      You rented this place on  <br />
                      {format(new Date(reservations[0]?.createdAt), 'yyyy-MM-dd')}
                      </p>
                  ) : (
                     <p className="text-lg font-semibold text-red-500">
                        This room is listed and cannot be reserved.
                      </p> 
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingDetail;
