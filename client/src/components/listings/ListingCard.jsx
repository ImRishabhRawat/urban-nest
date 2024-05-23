import { useNavigate } from 'react-router-dom';
import useStates from '../../hooks/useStates';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import HeartButton from '../HeartButton';
import Button from '../Button';
import { authContext } from '../../context/AuthContext';
import ReservationCount from '../ReservationCount';

const ListingCard = ({ data, reservation, reservationCount, onAction, disabled, actionLabel, actionId, secondaryAction, secondaryLabel, onCardClick }) => {
  const navigate = useNavigate();
  const { getByValue } = useStates();
  const location = getByValue(data);
  const { user, role } = useContext(authContext);

  const price = useMemo(() => {
    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation || !reservation.startDate) {
      return null;
    }
    const start = parseISO(reservation.startDate);
    if (isNaN(start)) {
      console.error('Invalid start date:', reservation.startDate);
      return 'Invalid date';
    }
    return format(start, 'PP');
  }, [reservation]);

  const handleClick = () => {
    if (onCardClick && role === "owner") {
      onCardClick(data._id);
    } else {
      navigate(`/listings/${data._id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className='col-span-1 cursor-pointer group'
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img src={data.images} alt="" className='w-full h-full object-cover group-hover:scale-110 transition' />
          <div className="absolute top-3 right-3">
            {role === "owner" && <ReservationCount count={reservationCount} />}
            {role !== "owner" && <HeartButton listingId={data._id} />}
          </div>
        </div>
        <div className="font-semibold text-lg ">
          {data.location && data.location.city && data.location.state ? `${data.location.city.label}, ${data.location.state.value}` : ''}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          <div className="font-light">month</div>
        </div>
        {data.status === "listed" &&  (
          <div className="font-bold flex items-center justify-center border-[2px] border-rose-500 rounded-lg">Listed</div>
        )}
        {onAction && actionLabel && data.status!=="listed" && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={onAction}
          />
        )}
        {secondaryAction && secondaryLabel && data.status!=="listed" && (
          <Button
            disabled={disabled}
            small
            outline
            label={secondaryLabel}
            onClick={secondaryAction}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
