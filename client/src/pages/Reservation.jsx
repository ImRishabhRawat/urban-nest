import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { BASE_URL, token } from "../config";
import { authContext } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import Container from "../components/Container";
import Heading from "../components/Heading";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

const Reservation = () => {
  const { user } = useContext(authContext);
  const [reservations, setReservations] = useState([]);
  const [processingId, setProcessingId] = useState("");

  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/student/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReservations(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  const onApprove = useCallback(async (id) => {
    console.log("Approving booking with id:", id);
    setProcessingId(id);

    try {
      await axios.post(
        `${BASE_URL}/booking/${id}/approve`,
        { userType: "student" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Reservation approved successfully");

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === id
            ? { ...reservation, studentApproved: true, status: "pending_owner" }
            : reservation
        )
      );
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setProcessingId("");
    }
  }, []);

  const onCancel = useCallback(async (id) => {
    console.log("Cancelling booking with id:", id);
    setProcessingId(id);

    try {
      await axios.delete(`${BASE_URL}/booking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Reservation cancelled successfully");

      setReservations((prev) =>
        prev.filter((reservation) => reservation._id !== id)
      );
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error(error?.response?.data?.error || "Something went wrong");
    } finally {
      setProcessingId("");
    }
  }, []);

  useEffect(() => {
    if (user && user._id) {
      fetchReservations();
    }
  }, [user]);

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No Reservations"
        subtitle="Looks like you do not schedule any visits"
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Bookings"
        subtitle="Your all bookings from previous and current"
      />
      <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation._id}
            data={reservation.room}
            reservation={reservation}
            actionId={reservation._id}
            onAction={() => onApprove(reservation._id)}
            secondaryAction={() => onCancel(reservation._id)}
            disabled={processingId === reservation._id}
            secondaryLabel="Cancel Visiting"
            actionLabel={
              reservation.studentApproved === true
                ? "Waiting for owner approval"
                : "Approve"
            }
          />
        ))}
      </div>
    </Container>
  );
};

export default Reservation;
  