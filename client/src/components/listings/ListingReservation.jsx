import { Range} from 'react-date-range'
import Calendar from '../input/Calendar'
import Button from '../Button'
import Heading from '../Heading'

const ListingReservation = ({ price, onChangeDate, dateRange, onSubmit, disabled, disabledDates, dayCount, alreadyScheduled}) => {
  return (
    <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
          <div className="flex flex-row gap-1 p-4">
              <div className="text-2xl font-semibold">
                  $ {price}
              </div>
              <div className="font-light text-neutral-600">
                  month
        </div>
        <div className="relative ml-2">
          <span className="text-red-500 cursor-pointer" >*</span>
          <div className="absolute top-full -left-20 w-64 p-2 mt-1 text-sm  font-light text-neutral-300 bg-neutral-800 rounded-md hidden tooltip">
            * Please note that this reservation is for scheduling a visit to inspect the room. You can cancel it at any time.
          </div>
        </div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value)=> onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button
          disabled={disabled}
          label={alreadyScheduled ? "Already Scheduled" : "Schedule Visit"}
          onClick={onSubmit}
        />
      </div>
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>
          <Heading
            subtitle="Your visiting days are"
          />
        </div>
        <div>
          {dayCount + 1}
        </div>
      </div>
    </div>
  )
}

export default ListingReservation
