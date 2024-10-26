import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  const currentUser = useCurrentUser();

  return (
    <footer className={styles.Footer}>
      <Container>
        <Row className="text-center py-3">
          <Col md={4}>
            <h5>About Us</h5>
            <p>
              We provide the best product comparisons to help you make informed
              decisions.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className={styles.FooterLinks}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              {currentUser && (
                <li>
                  <Link to={`/profiles/${currentUser.profile_id}`}>
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </Col>
          <Col md={4}>
            <h5>Follow Us</h5>
            <div className={styles.SocialIcons}>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className="text-center">
          <Col>
            <p className={styles.Copyright}>
              &copy; {new Date().getFullYear()} Product Comparison Site. All
              Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
