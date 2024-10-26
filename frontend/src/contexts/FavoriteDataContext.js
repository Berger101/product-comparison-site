import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";

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
        // console.error(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <FavoriteDataContext.Provider value={favoriteData}>
      <SetFavoriteDataContext.Provider value={{ setFavoriteData }}>
        {children}
      </SetFavoriteDataContext.Provider>
    </FavoriteDataContext.Provider>
  );
};
