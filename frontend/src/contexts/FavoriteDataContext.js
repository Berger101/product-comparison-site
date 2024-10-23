import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { favoriteHelper, unfavoriteHelper } from "../utils/utils";
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
      const response = await axiosRes.post(
        "/favorites/",
        { product: productId },
        config
      );

      if (response && response.data) {
        const { data } = response;
        setFavoriteData((prevState) => ({
          ...prevState,
          favoriteProducts: {
            ...prevState.favoriteProducts,
            results: [...prevState.favoriteProducts.results, data],
          },
        }));
        return data; // Return the data so it can be used in ProductPage.js
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
        favoriteProducts: {
          ...prevState.favoriteProducts,
          results: prevState.favoriteProducts.results.filter(
            (product) => product.id !== productId
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        if (currentUser) {
          const { data: favoriteProductsData } = await axiosReq.get(
            "/favorites/?user=" + currentUser.id
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
