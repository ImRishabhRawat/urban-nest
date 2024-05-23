import React from 'react'
import Avatar from '../Avatar'
import ListingCategory from './ListingCategory'
import Map from '../Map'

const ListingInfo = ({owner, description, studentCount, roomCount, bathroomCount, category, location}) => {
  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold flex flex-row items-center gap-2">
          <div className="">Hosted by {owner?.name}</div>
          <Avatar src={owner?.photo} />
        </div>
        <div className="flex flex-row items-center gap-4 font-light text-neutral-500">
          <div>
          {studentCount} students
          </div>
          <div>
          {roomCount} rooms
          </div>
          <div>
          {bathroomCount} bathrooms
          </div>
        </div>
      </div>
      <hr />
      {category && (
        
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <hr />
      <div className="text-lg font-light text-neutral-500">
        {description}
      </div>
      <hr />
      <Map center={location?.city?.latlng} />
    </div>
  )
}

export default ListingInfo
