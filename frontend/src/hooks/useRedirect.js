import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";

export const useRedirect = (userAuthStatus) => {
  const currentUser = useCurrentUser(); // Get the current user from the context
  const setCurrentUser = useSetCurrentUser(); // To set current user after refreshing tokens
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to refresh the token if the userAuthStatus is 'loggedIn'
        if (userAuthStatus === "loggedIn" && !currentUser) {
          // Attempt to refresh the token
          const response = await axios.post("/dj-rest-auth/token/refresh/");
          if (response.status === 200) {
            // If refresh was successful, update the user state
            const userResponse = await axios.get("/dj-rest-auth/user/");
            setCurrentUser(userResponse.data);
          }
        }
        
        if (userAuthStatus === "loggedIn" && currentUser) {
          // If the user is logged in and tries to access a "loggedOut" page, redirect to home
          navigate("/");
        }
      } catch (err) {
        
        // If token refresh fails and userAuthStatus is "loggedOut"
        if (userAuthStatus === "loggedOut" || err.response?.status === 401) {
          // Redirect logged-out users trying to access "loggedIn" pages
          navigate("/signin");
        }
      }
    };

    checkAuthStatus();
  }, [currentUser, navigate, userAuthStatus, setCurrentUser]);
};
