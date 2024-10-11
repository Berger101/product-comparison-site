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

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 401) {

        setCurrentUser(null); // Clear any current user data
      } else {
        // console.error("Error fetching current user:", err);
      }
    }
  };

  useEffect(() => {
    handleMount();
  }, []); // Fetch current user on mount

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
            // Try refreshing the token
            await axios.post("/dj-rest-auth/token/refresh/");
            return axios(err.config); // Retry the original request
          } catch (error) {
            setCurrentUser(null); // Clear user state
            navigate("/signin"); // Redirect to sign-in if token refresh fails
          }
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
