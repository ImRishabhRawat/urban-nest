import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { BASE_URL, token } from '../config';
import { authContext } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import Container from '../components/Container';
import Heading from '../components/Heading';
import ListingCard from '../components/listings/ListingCard';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useContext(authContext);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/getFavorites/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setFavorites(response.data.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchFavorites();
    }
  }, [user]);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings"
      />
    );
  }

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="Your favorite rooms"
      />
      <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favorites.map((favorite) => (
          <ListingCard
            key={favorite._id}
            data={favorite}
            onClick={() => navigate(`/listings/${favorite._id}`)}
          />
        ))}
      </div>
    </Container>
  );
}

export default Favorites;
