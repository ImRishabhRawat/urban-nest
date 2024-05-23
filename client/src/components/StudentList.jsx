import React from 'react';
import { format } from 'date-fns';

const StudentList = ({ reservations }) => {
  const sortedReservations = reservations.sort((a, b) => new Date(a.visitDates.startDate) - new Date(b.visitDates.startDate));

  return (
    <div className="mt-4">
      <h4>Reservations</h4>
      {sortedReservations.map((reservation) => (
        <div key={reservation._id} className="mb-2">
          <div className="flex justify-between items-center">
            <span>{reservation.user.name}</span>
            <span>{format(new Date(reservation.visitDates.startDate), 'PP')}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
