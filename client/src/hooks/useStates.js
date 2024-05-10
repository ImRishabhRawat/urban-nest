import { Country, State, City } from "country-state-city";

// Get the ISO code for India
let indiaISOCode = "IN";
console.log(indiaISOCode);
// Get all states of India
let statesOfIndia = State.getStatesOfCountry(indiaISOCode);
console.log(statesOfIndia);
const formattedStates = statesOfIndia.map((state) => ({
	value: state.isoCode,
	label: state.name,
	countryCode: state.countryCode,
	latitude: state.latitude,
	longitude: state.longitude,
	latlng: [state.latitude, state.longitude],
}));

const useStates = () => {
	const getAll = () => formattedStates;

	const getByValue = (value) => {
		return formattedStates.find((item) => item.value === value);
	};
	return {
		getAll,
		getByValue,
	};
};

export default useStates;
