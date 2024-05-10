import { useNavigate } from 'react-router-dom';
import useStates from '../../hooks/useStates';
import { useCallback, useMemo } from 'react';
import {format} from 'date-fns'
import HeartButton from '../HeartButton';
import Button from '../Button';


const ListingCard = ({ data, reservation, onAction, disabled, actionLabel, actionId, currentUser }) => {
  const navigate = useNavigate();
  const { getByValue } = useStates();
  const location = getByValue(data);

  const handleCancel = useCallback((e) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);

  },[onAction, actionId, disabled])

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
    const start = new Date(reservation.startDate);

    return `${format(start, 'PP')} `
  },[])


  return (
    <div
    onClick={()=> navigate(`/listings/${data.id}`)}
      className='col-span-1 cursor-pointer group'>
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img src={data.images} alt="" className='w-full h-full object-cover group-hover:scale-110 transition' />
          <div className="absolute top-3 right-3">
            <HeartButton
              listingId={data._id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className="font-semibold text-lg ">
          {/* location ex. cityLabel, stateValue */} 
          {data.location && data.location.city && data.location.state ? `${data.location.city.label}, ${data.location.state.value}` : ''}
        </div>
        <div className="font-light text-neutral-500">
          {reservation || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">
            $ {price}
          </div>
          {!reservation && (
            <div className="font-light">month</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ListingCard
