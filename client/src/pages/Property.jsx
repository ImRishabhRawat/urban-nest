import React, { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL, token } from "../config";
import { authContext } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import useLoginModal from "../hooks/useLoginModal";

const   Property = () => {
  const { user } = useContext(authContext);
  const loginModal = useLoginModal();
  const [properties, setProperties] = useState([]);
  const [reservationsCount, setReservationsCount] = useState({});
  const navigate = useNavigate();

  if (user?.role === "student") {
    loginModal.onOpen();
    return null;
  }

  const fetchPropertiesAndReservations = useCallback(async () => {
    try {
      // Fetch owner's properties
      const propertiesResponse = await axios.get(`${BASE_URL}/room/owner/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const propertiesData = propertiesResponse.data.data;
      setProperties(propertiesData);

      // Fetch reservations for each property and count them
      const propertyIds = propertiesData.map((property) => property._id);
      console.log("Property IDs:", propertyIds); // Debug log
      const reservationsPromises = propertyIds.map(async (id) => {
        try {
          const res = await axios.get(`${BASE_URL}/booking/listing/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return { id, count: res.data.data.length };
        } catch (err) {
          console.error(`Error fetching reservations for property ${id}:`, err); // Debug log
          if (err.response && err.response.status === 404) {
            return { id, count: 0 };
          } else {
            throw err;
          }
        }
      });

      const reservationsCounts = await Promise.all(reservationsPromises);
      const counts = reservationsCounts.reduce((acc, { id, count }) => {
        acc[id] = count;
        return acc;
      }, {});
      setReservationsCount(counts);
    } catch (err) {
      console.error("Error fetching properties and reservations:", err);
    }
  }, [user._id]);

  useEffect(() => {
    if (user && user._id) {
      fetchPropertiesAndReservations();
    }
  }, [user, fetchPropertiesAndReservations]);

  const handleCardClick = (propertyId) => {
    navigate(`/owner/room/${propertyId}`);
  };

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No Properties"
        subtitle="Looks like you do not have any properties listed"
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Your Properties"
        subtitle="All your listed properties"
      />
      <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {properties.map((property) => (
          <ListingCard
            key={property._id}
            data={property}
            reservationCount={reservationsCount[property._id] || 0}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </Container>
  );
};

export default Property;
