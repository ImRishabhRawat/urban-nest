import { Country, State, City } from "country-state-city";
import { useEffect, useState } from "react";
const useCities = (stateIso) => {
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCities = async () => {
			setLoading(true);
			try {
				const cities = City.getCitiesOfState("IN",stateIso);
				const formattedCities = cities.map((city) => ({
					value: city.isoCode,
					label: city.name,
					stateCode: city.stateCode,
					countryCode: city.countryCode,
					latitude: city.latitude,
					longitude: city.longitude,
					latlng: [city.latitude, city.longitude],
				}));
				setCities(formattedCities);
				setError(null);
			} catch (error) {
				setError(error);
			}
			setLoading(false);
		};

		fetchCities();
	}, [stateIso]);

	const getAll = () => cities;
	const getByValue = (value) => {
		return cities.find((item) => item.value === value);
	};

	return { cities, loading, error, getAll, getByValue };
};

export default useCities