import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
// import useFavorite from '../hooks/useFavorite.js';
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLoginModal from "../hooks/useLoginModal"
import { BASE_URL, token } from "../config";
import { authContext } from "../context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios';


const useFavorite = (listingId) => {
  const { user, dispatch } = useContext(authContext);
  const navigate = useNavigate();
  const loginModal = useLoginModal();

  const [isFavorited, setIsFavorited] = useState(() =>
    user?.favoriteIds?.includes(listingId)
  );
  useEffect(() => {
    console.log("user", user  );
  },[user])

  const toggleFavorite = useCallback(
    async (e) => {
      e.stopPropagation();
      if (!user) {
        return loginModal.onOpen();
      }

      try {
        let response;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if (isFavorited) {
          response = await axios.delete(
            `${BASE_URL}/user/removeFavorite/${user._id}/${listingId}`,
            { headers }
          );
          if (response.status === 200) {
            setIsFavorited(false);
            toast.success('Successfully removed from favorites');
          }
        } else {
          response = await axios.post(
            `${BASE_URL}/user/addFavorite/${user._id}/${listingId}`,
            {},
            { headers }
          );
          if (response.status === 200) {
            setIsFavorited(true);
            toast.success('Successfully added to favorites');
          }
        }

        if (response.status === 200) {
          dispatch({ type: 'UPDATE_FAVORITES', payload: { user: response.data.data } });
        }
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
        setIsFavorited(isFavorited);
      }
    },
    [user, isFavorited, listingId, loginModal, dispatch]
  );

  return {
    toggleFavorite,
    isFavorited,
  };
};

const HeartButton = ({ listingId }) => {
    const { isFavorited, toggleFavorite } = useFavorite(listingId);

    return (
        <div onClick={toggleFavorite}
             className='relative hover:opacity-80 transition cursor-pointer'>
            <AiOutlineHeart
                size={28}
                className='fill-white absolute -top-[2px] -right-[2px]'
            />
            <AiFillHeart
                size={24}
                className={isFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
            />
        </div>
    );
}

export default HeartButton;