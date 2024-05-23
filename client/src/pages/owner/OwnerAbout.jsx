const OwnerAbout = ({ owner }) => {
  return (
    <div>
      <div>
        <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold flex items-center gap-2">
          About
          <span className='text-irisBlueColor font-bold text-[24px] leading-9'>
            {owner.name}
          </span>
        </h3>
      </div>

      <div className="flex items-center gap-4 mb-10 mt-4">
        <figure className='max-w-[200px] max-h-[200px] overflow-hidden object-cover'>
          <img src={owner?.photo} alt={owner.name} />
        </figure>
        <div>
          <p className="text-[16px] leading-6 font-medium text-textColor">
            <strong>Email: </strong>{owner.email}
          </p>
          <p className="text-[16px] leading-6 font-medium text-textColor">
            <strong>Phone: </strong>{owner.phone}
          </p>
          <p className="text-[16px] leading-6 font-medium text-textColor">
            <strong>Gender: </strong>{owner.gender}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OwnerAbout;
