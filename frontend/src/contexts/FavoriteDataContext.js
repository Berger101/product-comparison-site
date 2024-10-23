import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { favoriteHelper, unfavoriteHelper } from "../utils/utils"; // Make sure these are imported correctly
import { getAuthHeaders } from "../utils/tokenUtils";

const FavoriteDataContext = createContext();
const SetFavoriteDataContext = createContext();

export const useFavoritesData = () => useContext(FavoriteDataContext);
export const useSetFavoritesData = () => useContext(SetFavoriteDataContext);

export const FavoriteDataProvider = ({ children }) => {
  const [favoriteData, setFavoriteData] = useState({
    pageProfile: { results: [] },
    favoriteProducts: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFavorite = async (productId) => {
    try {
      const config = getAuthHeaders();
      const payload = { product: productId };
      console.log("Payload being sent:", payload);
      const response = await axiosRes.post("/favorites/", payload, config);

      if (response && response.data) {
        console.log("Favorite response data:", response.data);
        const { id: favoriteId } = response.data; // Destructure the ID from the response data

        setFavoriteData((prevState) => ({
          ...prevState,
          pageProfile: {
            results: prevState.pageProfile.results.map((profile) =>
              favoriteHelper(profile, { id: productId }, favoriteId)
            ),
          },
          favoriteProducts: {
            ...prevState.favoriteProducts,
            results: [
              ...prevState.favoriteProducts.results,
              response.data, // Add the full response data to maintain consistency
            ],
          },
        }));

        return response.data; // Return the response data so it can be used in ProductPage.js
      } else {
        console.error("No data returned from the backend.");
      }
    } catch (err) {
      console.error("Error in handleFavorite:", err);
    }
  };

  const handleUnfavorite = async (productId, favoriteId) => {
    try {
      const config = getAuthHeaders();

      await axiosRes.delete(`/favorites/${favoriteId}/`, config);

      setFavoriteData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfavoriteHelper(profile, { id: productId })
          ),
        },
        favoriteProducts: {
          ...prevState.favoriteProducts,
          results: prevState.favoriteProducts.results.filter(
            (product) => product.id !== productId
          ),
        },
      }));
    } catch (err) {
      console.error("Error in handleUnfavorite:", err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        if (currentUser) {
          const { data: favoriteProductsData } = await axiosReq.get(
            `/favorites/?user=${currentUser.id}`
          );

          setFavoriteData((prevState) => ({
            ...prevState,
            favoriteProducts: favoriteProductsData,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <FavoriteDataContext.Provider value={favoriteData}>
      <SetFavoriteDataContext.Provider
        value={{ setFavoriteData, handleFavorite, handleUnfavorite }}
      >
        {children}
      </SetFavoriteDataContext.Provider>
    </FavoriteDataContext.Provider>
  );
};
