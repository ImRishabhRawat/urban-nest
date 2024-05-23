import { useNavigate } from "react-router-dom";
import useSearchModal from "../../hooks/useSearchModal";
import Modals from "./Modals";
import { useCallback, useMemo, useState } from "react";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import StateSelect from "../input/StateSelect";
import CitySelect from "../input/CitySelect";
import Map from "../Map";
import qs from 'query-string';
import Calendar from "../input/Calendar";
import Counter from "../input/Counter";

const STEPS = {
  LOCATION: 0,
  DATE: 1,
  INFO: 2,
};

const SearchModal = () => {
  const navigate = useNavigate();
  const searchModal = useSearchModal();
  const [location, setLocation] = useState({});
  const [step, setStep] = useState(STEPS.LOCATION);
  const [studentCount, setStudentCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    const params = new URLSearchParams(window.location.search);
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery = {
      ...currentQuery,
      locationValue: location?.value,
      studentCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }
    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const queryString = qs.stringify(updatedQuery, { skipNull: true });
    const url = `/?${queryString}`;

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    navigate(url);
  }, [
    step,
    searchModal,
    location,
    navigate,
    studentCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }
    return 'Next';
  }, [step]);

  const secondaryLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go"
        subtitle="Find the perfect location"
      />
      <StateSelect
        value={location.state}
        onChange={(value) => setLocation({ ...location, state: value })}
      />
      <CitySelect
        stateValue={location.state}
        cityValue={location.city}
        onCityChange={(value) => setLocation({ ...location, city: value })}
      />
      <hr />
      <Map
        center={location.city?.latlng || location.state?.latlng}
      />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to visit?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect room!"
        />
        <Counter
          title="Students"
          subtitle="How many room partners do you want?"
          value={studentCount}
          onChange={(value) => setStudentCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  return (
    <Modals
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryLabel={secondaryLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default SearchModal;
