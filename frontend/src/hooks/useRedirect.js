import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCurrentUser } from "../contexts/CurrentUserContext";

export const useRedirect = (userAuthStatus) => {
  const currentUser = useCurrentUser(); // Get the current user from the context
  const navigate = useNavigate();

  useEffect(() => {
    if (userAuthStatus === "loggedIn" && !currentUser) {
      // If the user is not logged in but tries to access a "loggedIn" page, redirect to sign-in
      navigate("/signin");
    }

    if (userAuthStatus === "loggedOut" && currentUser) {
      // If the user is logged in but tries to access a "loggedOut" page, redirect to home
      navigate("/");
    }
  }, [currentUser, navigate, userAuthStatus]);
};
