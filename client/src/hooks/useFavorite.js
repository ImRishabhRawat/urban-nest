// useFavorite.js

import { useCallback, useContext, useMemo } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL, token } from "../config";
import { authContext } from "../context/AuthContext";

const useFavorite = ({ listingId, currentUser }) => {
	const { user } = useContext(authContext);

	const hasFavorited = useMemo(() => {
		const list = user?.favoriteIds || [];
		return list.includes(listingId);
	}, [user, listingId]);

	const toggleFavorite = useCallback(
		async (e) => {
			e.stopPropagation();

			if (!user) {
				return toast.error("Please log in to add to favorites");
			}

			try {
				const url = hasFavorited
					? `${BASE_URL}/user/${currentUser._id}/favorites/${listingId}`
					: `${BASE_URL}/user/${currentUser._id}/favorites/${listingId}`;
				const method = hasFavorited ? "delete" : "post";

				await axios[method](
					url,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				toast.success(
					hasFavorited ? "Removed from favorites" : "Added to favorites"
				);
			} catch (error) {
				toast.error("Something went wrong");
			}
		},
		[user, hasFavorited, listingId]
	);

	return {
		hasFavorited,
		toggleFavorite,
	};
};

export default useFavorite;
