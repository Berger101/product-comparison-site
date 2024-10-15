import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import styles from "../../styles/CommentCreateEditForm.module.css";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { getAuthHeaders } from "../../utils/tokenUtils";

function CommentCreateForm(props) {
  const { product, setProduct, setComments, profileImage, profile_id } = props;
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const config = getAuthHeaders();

      const { data } = await axiosRes.post(
        "/comments/",
        {
          content,
          product,
        },
        config // Pass the config with headers
      );
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setProduct((prevProduct) => ({
        results: [
          {
            ...prevProduct.results[0],
            comments_count: prevProduct.results[0].comments_count + 1,
          },
        ],
      }));
      setContent("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profileImage} />
          </Link>
          <Form.Control
            className={styles.Form}
            placeholder="my comment..."
            as="textarea"
            value={content}
            onChange={handleChange}
            rows={2}
          />
        </InputGroup>
      </Form.Group>
      <Button
        className={`${styles.Button} btn d-block ml-auto`}
        disabled={!content.trim()}
        type="submit"
      >
        post
      </Button>
    </Form>
  );
}

export default CommentCreateForm;
