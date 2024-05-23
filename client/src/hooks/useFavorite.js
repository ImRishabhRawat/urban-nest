import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useLoginModal from "./useLoginModal";
import { BASE_URL } from "../config";
import { authContext } from "../context/AuthContext";
import { useContext } from "react";


const useFavorite = ({ listingId }) => {
	const { user } = useContext(authContext);
	const navigate = useNavigate();
	const loginModal = useLoginModal();

	// State to manage favorite status optimistically
	const [isFavorited, setIsFavorited] = useState(() =>
		user?.favoriteIds?.includes(listingId)
	);

	const toggleFavorite = useCallback(
		async (e) => {
			e.stopPropagation();
			if (!user) {
				return loginModal.onOpen();
			}

			try {
				let response;

				if (isFavorited) {
					response = await axios.delete(
						`${BASE_URL}/user/removeFavorite/${user._id}/${listingId}`
					);
					if (response.status === 200) {
						setIsFavorited(false); // Update state to not favorited
						toast.success("Successfully removed from favorites");
					}
				} else {
					response = await axios.post(
						`${BASE_URL}/user/addFavorite/${user._id}/${listingId}`
					);
					if (response.status === 200) {
						setIsFavorited(true); // Update state to favorited
						toast.success("Successfully added to favorites");
					}
				}
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong");
				// Revert optimistic update if there was an error
				setIsFavorited(isFavorited);
			}
		},
		[user, isFavorited, listingId, loginModal]
	);

	return {
		toggleFavorite,
		isFavorited,
	};
};

export default useFavorite;
