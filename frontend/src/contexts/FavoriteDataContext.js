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
    pageProfile: { results: [] }, // Stores data for the clicked profile
    popularProfiles: { results: [] }, // Stores popular profiles or products
    favoriteProducts: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFavorite = async (clickedProduct) => {
    try {
      const config = getAuthHeaders();

      const { data } = await axiosRes.post("/favorites/", {
        product: clickedProduct.id,
      }, config);

      setFavoriteData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            favoriteHelper(profile, clickedProduct, data.id)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            favoriteHelper(profile, clickedProduct, data.id)
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfavorite = async (clickedProduct) => {
    try {
      const config = getAuthHeaders();

      await axiosRes.delete(`/favorites/${clickedProduct.favorite_id}/`, config);

      setFavoriteData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfavoriteHelper(profile, clickedProduct, null)
          ),
        },
        popularProfiles: {
          ...prevState.popularProfiles,
          results: prevState.popularProfiles.results.map((profile) =>
            unfavoriteHelper(profile, clickedProduct, null)
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
        // Fetch popular profiles based on product counts or other criteria
        const { data: popularProfilesData } = await axiosReq.get(
          "/profiles/?ordering=-products_count"
        );

        setFavoriteData((prevState) => ({
          ...prevState,
          popularProfiles: popularProfilesData,
        }));
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
