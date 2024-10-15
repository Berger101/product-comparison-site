import React from "react";
import styles from "../../styles/Product.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Product = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    votes_count,
    vote_id,
    title,
    content,
    image,
    updated_at,
    productPage,
    setProducts,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const navigate = useNavigate();

  const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken"))
      ?.split("=")[1];
    return csrfCookie;
  };

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = getCsrfToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      };

      await axiosRes.delete(`/products/${id}/`, config);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVote = async () => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = getCsrfToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      };

      const { data } = await axiosRes.post("/votes/", { product: id }, config);
      setProducts((prevProducts) => ({
        ...prevProducts,
        results: prevProducts.results.map((product) => {
          return product.id === id
            ? {
                ...product,
                votes_count: product.votes_count + 1,
                vote_id: data.id,
              }
            : product;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnvote = async () => {
    try {
      const token = localStorage.getItem("token");
      const csrfToken = getCsrfToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      };

      await axiosRes.delete(`/votes/${vote_id}/`, config);
      setProducts((prevProducts) => ({
        ...prevProducts,
        results: prevProducts.results.map((product) => {
          return product.id === id
            ? {
                ...product,
                votes_count: product.votes_count - 1,
                vote_id: null,
              }
            : product;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Product}>
      <Card.Body>
        <div className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && productPage && (
              <MoreDropdown
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </Card.Body>
      <Link to={`/products/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        {content && <Card.Text>{content}</Card.Text>}
        <div className={styles.ProductBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't vote on your own product!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          ) : vote_id ? (
            <span onClick={handleUnvote}>
              <i className={`fas fa-heart ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleVote}>
              <i className={`far fa-heart ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to vote on products!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {votes_count}
          <Link to={`/products/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
