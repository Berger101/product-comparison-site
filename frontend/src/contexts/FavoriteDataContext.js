import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";
import { favoriteHelper, unfavoriteHelper } from "../utils/utils";

const FavoriteDataContext = createContext();
const SetFavoriteDataContext = createContext();

export const useFavoritesData = () => useContext(FavoriteDataContext);
export const useSetFavoritesData = () => useContext(SetFavoriteDataContext);

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper function to get the CSRF token from the cookies
const getCsrfToken = () => {
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
  return csrfCookie;
};

export const FavoriteDataProvider = ({ children }) => {
  const [favoriteData, setFavoriteData] = useState({
    pageProfile: { results: [] },
    favoriteProducts: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFavorite = async (clickedProduct) => {
    try {
      const token = getToken();
      const csrfToken = getCsrfToken();

      // Pass the token and CSRF token in the headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      };

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
        favoriteProducts: {
          ...prevState.favoriteProducts,
          results: prevState.favoriteProducts.results.map((product) =>
            favoriteHelper(product, clickedProduct, data.id)
          ),
        },
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnfavorite = async (clickedProduct) => {
    try {
      const token = getToken();
      const csrfToken = getCsrfToken();

      // Pass the token and CSRF token in the headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      };

      await axiosRes.delete(`/favorites/${clickedProduct.favorite_id}/`, config);

      setFavoriteData((prevState) => ({
        ...prevState,
        pageProfile: {
          results: prevState.pageProfile.results.map((profile) =>
            unfavoriteHelper(profile, clickedProduct, null)
          ),
        },
        favoriteProducts: {
          ...prevState.favoriteProducts,
          results: prevState.favoriteProducts.results.map((product) =>
            unfavoriteHelper(product, clickedProduct, null)
          ),
        },
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get("/products/?ordering=-favorites_count");
        setFavoriteData((prevState) => ({
          ...prevState,
          favoriteProducts: data,
        }));
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <FavoriteDataContext.Provider value={favoriteData}>
      <SetFavoriteDataContext.Provider value={{ setFavoriteData, handleFavorite, handleUnfavorite }}>
        {children}
      </SetFavoriteDataContext.Provider>
    </FavoriteDataContext.Provider>
  );
};