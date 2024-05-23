import React from 'react';

const ReservationCount = ({ count }) => {
  return (
    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
      <span className="text-sm font-semibold">{count}</span>
    </div>
  );
};

export default ReservationCount;
    