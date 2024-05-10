import  { useContext, useEffect, useState } from 'react'
import Container from '../components/Container'
import EmptyState from '../components/EmptyState';
import axios from 'axios';
import { BASE_URL } from '../config';
import ListingCard from '../components/listings/ListingCard';
import { authContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(authContext);


   const [rooms, setRooms] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/room`);
        setRooms(response.data.data);
        setIsEmpty(response.data.data.length === 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  if (isEmpty) {
    return (
      <EmptyState showReset />
    )
  }
  return (
    <Container >
      <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {rooms.map((room) => {
          return (
            
            <ListingCard
            key={room.id}
              currentUser={user} 
              data={room} 
            />
           )
         })}
        </div>
    </Container>
  )
}

export default Home
