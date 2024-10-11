import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink, useLocation } from "react-router-dom";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { getAuthHeaders } from "../utils/tokenUtils";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const location = useLocation();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const getNavLinkClass = (path) =>
    location.pathname === path
      ? `${styles.NavLink} ${styles.Active}`
      : styles.NavLink;

  const handleSignOut = async () => {
    try {
      const config = getAuthHeaders();

      await axios.post("/dj-rest-auth/logout/", null, {
        ...config,
      withCredentials: true,
    });

      setCurrentUser(null); // Clear current user state immediately
    } catch (err) {
    }
  };

  const addPostIcon = (
    <NavLink className={styles.NavLink} to="/posts/create">
      <i className="far fa-plus-square"></i> Add post
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink className={getNavLinkClass("/feed")} to="/feed">
        <i className="fas fa-stream"></i> Feed
      </NavLink>
      <NavLink className={getNavLinkClass("/liked")} to="/liked">
        <i className="fas fa-heart"></i> Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i> Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink className={getNavLinkClass("/signin")} to="/signin">
        <i className="fas fa-sign-in-alt"></i> Sign in
      </NavLink>
      <NavLink className={getNavLinkClass("/signup")} to="/signup">
        <i className="fas fa-user-plus"></i> Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink className={getNavLinkClass("/")} to="/">
              <i className="fas fa-home"></i> Home
            </NavLink>

            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
