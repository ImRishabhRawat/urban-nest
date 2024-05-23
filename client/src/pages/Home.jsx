import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import axios from 'axios';
import { BASE_URL } from '../config';
import ListingCard from '../components/listings/ListingCard';
import { authContext } from '../context/AuthContext';
import qs from 'query-string';

const Home = () => {
  const { user } = useContext(authContext);
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const query = qs.parse(location.search);
      const hasFilters = Object.keys(query).length > 0;

      try {
        const endpoint = hasFilters ? `${BASE_URL}/room/filter` : `${BASE_URL}/room`;
        const response = await axios.get(endpoint, { params: query });
        setRooms(response.data.data);
        setIsEmpty(response.data.data.length === 0);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [location.search]);

  if (isEmpty) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {rooms.map((room) => (
          <ListingCard key={room._id} data={room} />
        ))}
      </div>
    </Container>
  );
};

export default Home;
