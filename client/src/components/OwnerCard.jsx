import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const OwnerCard = ({ owner }) => {
  const { name, properties, photo } = owner;
  return (
    <div className="p-3 lg:p-5">
      <div>
        <img src={photo} alt="Owner image" className="w-full" />
      </div>
      <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5">
        {name}
      </h2>
      <div className="mt-2 lg:mt-4 flex items-center justify-between">
        <span className="bg-[#ccf0f3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded">
          {properties.length} Properties
        </span>
      </div>
      <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
        <Link to={`/owners/${owner._id}`} className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none">
          <BsArrowRight className='group-hover:text-white w-6 h-5'/>
        </Link>
      </div>
    </div>
  );
};

export default OwnerCard;
