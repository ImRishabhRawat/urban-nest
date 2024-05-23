import React, { useContext, useEffect, useState } from 'react';
import { authContext } from '../context/AuthContext';
import ListingCard from './listings/ListingCard';
import EmptyState from './EmptyState';
import axios from 'axios';
import { BASE_URL, token } from '../config';

const MyBookings = () => {
    const { user } = useContext(authContext);
    const [reservations, setReservations] = useState([]);

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
        } catch (err) {
            console.error("Error fetching reservations:", err);
        }
    };

    useEffect(() => {
        if (user && user._id) {
            fetchReservations();
        }
    }, [user]);

    if (reservations.length === 0) {
        return <EmptyState title="No Reservations" subtitle="Looks like you do not schedule any visits" />;
    }

    return (
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {reservations.map((reservation) => (
                <ListingCard
                    key={reservation._id}
                    data={reservation.room}
                />
            ))}
        </div>
    );
};

export default MyBookings;
