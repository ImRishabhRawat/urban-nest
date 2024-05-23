import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BASE_URL, token } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { authContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import Container from "../components/Container";
import ListingHead from "../components/listings/ListingHead";
import ListingInfo from "../components/listings/ListingInfo";
import { categories } from "../components/Header/Categories";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const OwnerRoomDetails = () => {
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [reservations, setReservations] = useState([]);

  const fetchRoomDetails = async () => {
    try {
      console.log("Fetching room details...");
      const response = await axios.get(`${BASE_URL}/room/${roomId}`);
      console.log("Room details fetched:", response.data.data); // Debug log
      setRoom(response.data.data);
    } catch (err) {
      console.error("Error fetching room details:", err);
      toast.error("Failed to fetch room details");
    }
  };

  const fetchReservations = async () => {
    try {
      console.log(`Fetching reservations with token: ${token}`);
      const response = await axios.get(
        `${BASE_URL}/booking/listing/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        },
      );
      console.log("Reservations fetched:", response.data.data); // Debug log
      setReservations(response.data.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      toast.error("Failed to fetch reservations");
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
      fetchReservations();
    }
  }, [roomId]);

  const onApprove = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/booking/${id}/approve`,
        { userType: "owner" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Reservation approved successfully");
      fetchReservations();
      fetchRoomDetails();
    } catch (error) {
      console.error("Error approving reservation:", error); // Debug log
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  };

  const onCancel = useCallback(async (id) => {
    console.log("Cancelling booking with id:", id);

    try {
      await axios.delete(`${BASE_URL}/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Reservation cancelled successfully");

      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== id),
      );
    } catch (error) {
      console.error("Error cancelling reservation:", error); // Debug log
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
  }, []);

  const category = useMemo(() => {
    if (room && Array.isArray(room.category) && room.category.length > 0) {
      return categories.find((item) => item.label === room.category[0]);
    }
    return null;
  }, [room]);

  if (!room)
    return (
      <EmptyState
        title="No Room"
        subtitle="Looks like this room is not available"
      />
    );

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={room?.title}
            imageSrc={room?.images}
            location={room?.location}
            id={room?._id}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              owner={room?.owner}
              category={category}
              description={room?.description}
              roomCount={room?.roomCount}
              studentCount={room?.studentCount}
              bathroomCount={room?.bathroomCount}
              location={room?.location}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <h4 className="text-xl font-semibold mb-4">Reservations</h4>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <div
                    key={reservation?._id}
                    className={`mb-2 border-b pb-2 ${reservation?.status === "rejected" ? "text-red-500" : ""}`}
                  >
                    <div className="flex flex-col mb-2">
                      <img
                        src={reservation?.user?.photo || "/placeholder.jpg"}
                        alt="Student"
                        className="w-16 h-16 rounded-full mb-2"
                      />
                      <span>
                        <strong>Name:</strong>{" "}
                        {reservation?.user?.name || "N/A"}
                      </span>
                      <span>
                        <strong>Email:</strong>{" "}
                        {reservation?.user?.email || "N/A"}
                      </span>
                      <span>
                        <strong>Visit Date:</strong>{" "}
                        {reservation?.visitDates
                          ? new Date(
                              reservation?.visitDates.startDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    {reservation?.status === "pending" && (
                      <div className="flex justify-between items-center mt-2">
                        <Button
                          small
                          label={
                            reservation.studentApproved === true
                              ? "Waiting for student approval"
                              : "Approve"
                          }
                          onClick={() => onApprove(reservation?._id)}
                        />
                        <Button
                          outline
                          small
                          label="Cancel"
                          onClick={() => onCancel(reservation?._id)}
                        />
                      </div>
                    )}
                    {reservation?.status === "approved" && (
                      <div className="flex justify-between items-center mt-2">
                        <Button
                          outline
                          small
                          label="Room khali kar"
                          onClick={() => onCancel(reservation?._id)}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No reservations found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OwnerRoomDetails;
