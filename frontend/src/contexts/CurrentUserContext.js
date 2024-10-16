import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Function to fetch the current user's data
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setCurrentUser(data); // Set the current user state

      // Fetch the profile information for the logged-in user
      if (data?.pk) {
        const { data: profileData } = await axiosReq.get(
          `/profiles/${data.pk}/`
        );
        setCurrentUser((prevUser) => ({
          ...prevUser,
          profile_id: profileData.id,
          profile_image: profileData.profile_image,
        }));
      }
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setCurrentUser(null); // Clear any current user data
      }
    }
  };

  useEffect(() => {
    handleMount(); // Fetch current user on mount
  }, []);

  // Handle token refresh for 401 errors
  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            // Attempt token refresh
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(err.config); // Retry the original request
          } catch (error) {
            setCurrentUser(null); // Clear user state if token refresh fails
            navigate("/signin"); // Redirect to sign-in
          }
        }
        return Promise.reject(err);
      }
    );

    // Cleanup interceptors
    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  // Ensure context updates propagate to all components
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
