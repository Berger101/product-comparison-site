import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { getAuthHeaders } from "../../utils/tokenUtils";

const UsernameForm = () => {
  const [username, setUsername] = useState("");
  const [errors] = useState({});
  const [isOwner, setIsOwner] = useState(false);  // track if the user is the owner

  const navigate = useNavigate();
  const { id } = useParams();  // This is the profile ID, not the username

  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get(`/profiles/${id}/`);
        const { owner } = data;  // Get the profile owner from the API response

        // Check if the current user's username matches the profile owner
        if (currentUser?.username === owner) {
          setUsername(currentUser.username);
          setIsOwner(true);
        } else {
          navigate("/");
        }
      } catch (err) {
        // console.log(err);
        navigate("/");
      }
    };

    if (currentUser) {
      handleMount();
    }
  }, [currentUser, navigate, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = getAuthHeaders();

      await axiosRes.put("/dj-rest-auth/user/", { username }, config);

      setCurrentUser((prevUser) => ({
        ...prevUser,
        username,
      }));
      navigate(-1);
    } catch (err) {
      // console.log(err);
<<<<<<< HEAD
      setErrors(err.response?.data);
=======
>>>>>>> 9a194b6ccff039ec0b262e52262d95632a2902a7
    }
  };

  if (!isOwner) {
    return null;  // Don't render if the user is not the owner
  }

  return (
    <Row>
      <Col className="py-2 mx-auto text-center" md={6}>
        <Container className={appStyles.Content}>
          <Form onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Change username</Form.Label>
              <Form.Control
                placeholder="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Form.Group>
            {errors?.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              onClick={() => navigate(-1)}
            >
              cancel
            </Button>
            <Button
              className={`${btnStyles.Button} ${btnStyles.Blue}`}
              type="submit"
            >
              save
            </Button>
          </Form>
        </Container>
      </Col>
    </Row>
  );
};

export default UsernameForm;
