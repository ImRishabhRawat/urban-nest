import React from 'react';
import Heading from './Heading';
import Button from './Button';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'query-string';

const EmptyState = ({ title = "No exact matches", subtitle = "Try changing or removing some of your filters", showReset }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleResetFilters = () => {
    const query = qs.parse(location.search);
    const resetQuery = {};
    const queryString = qs.stringify(resetQuery, { skipNull: true });
    navigate(`/?${queryString}`);
  };

  return (
    <div className='h-[60vh] flex flex-col gap-2 justify-center items-center'>
      <Heading
        center
        title={title}
        subtitle={subtitle}
      />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label="Remove all filters"
            onClick={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
