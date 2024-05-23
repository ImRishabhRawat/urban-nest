import Heading from "../Heading";
import HeartButton from "../HeartButton";

const ListingHead = ({ title, location, imageSrc, id }) => {
  return (
    <>
      <Heading
        title={title}
        subtitle={` ${location?.city?.label}, ${location?.state?.value}`}
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <img src={imageSrc} alt="Image" className="object-cover w-full" />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} />
        </div>
      </div>
    </>
  );
};

export default ListingHead;
