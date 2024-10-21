import React, { useState, useEffect } from "react";
import styles from "../../styles/Product.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { getAuthHeaders } from "../../utils/tokenUtils";

const Product = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    vote_id,
    current_rating,
    user_rating,
    votes_count,
    name,
    description,
    image,
    updated_at,
    price,
    category,
    productPage,
    setProducts,
  } = props;

  // User's rating input
  const [userVote, setUserVote] = useState(user_rating || 0);
  // Average rating
  const [averageRating, setAverageRating] = useState(current_rating || 0);
  // Number of users who rated the product
  const [totalVotes, setTotalVotes] = useState(votes_count || 0);

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const navigate = useNavigate();

  useEffect(() => {
    // Sync user rating and average rating when the component first loads or refreshes
    setUserVote(user_rating || 0);
    setAverageRating(current_rating || 0);
    setTotalVotes(votes_count || 0);
  }, [user_rating, current_rating, votes_count]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const config = getAuthHeaders();

      await axiosRes.delete(`/products/${id}/`, config);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserRating = async (rating) => {
    // If the user clicks the same rating, they can remove their rating
    const newRating = rating === userVote ? 0 : rating;

    // Temporarily show the selected user rating
    setUserVote(newRating);

    try {
      const config = getAuthHeaders();

      if (newRating === 0 && vote_id) {
        // Delete the vote if the user wants to remove their rating
        await axiosRes.delete(`/votes/${vote_id}/`, config);
        setProducts((prevProducts) => ({
          ...prevProducts,
          results: prevProducts.results.map((product) => {
            const remainingVotes = product.votes_count - 1;

            return product.id === id
              ? {
                  ...product,
                  user_rating: 0, // Reset the user's rating
                  vote_id: null, // Remove vote_id
                  current_rating:
                    remainingVotes > 0
                      ? (product.current_rating * product.votes_count -
                          userVote) /
                        remainingVotes
                      : 0, // Update or reset the average rating
                  votes_count: remainingVotes, // Decrease vote count
                }
              : product;
          }),
        }));
      } else if (vote_id) {
        // Update the vote if it exists
        await axiosRes.put(
          `/votes/${vote_id}/`,
          { product: id, rating: newRating },
          config
        );
        setProducts((prevProducts) => ({
          ...prevProducts,
          results: prevProducts.results.map((product) => {
            return product.id === id
              ? {
                  ...product,
                  user_rating: newRating, // Update the user's own rating
                  current_rating:
                    (product.current_rating * product.votes_count -
                      userVote +
                      newRating) /
                    product.votes_count, // Update the average rating
                }
              : product;
          }),
        }));
      } else {
        // Create a new vote if none exists
        const { data } = await axiosRes.post(
          "/votes/",
          { product: id, rating: newRating },
          config
        );
        setProducts((prevProducts) => ({
          ...prevProducts,
          results: prevProducts.results.map((product) => {
            return product.id === id
              ? {
                  ...product,
                  user_rating: newRating, // New user rating
                  vote_id: data.id, // Store vote_id
                  current_rating:
                    (product.current_rating * product.votes_count + newRating) /
                    (product.votes_count + 1), // Update the average rating
                  votes_count: product.votes_count + 1, // Increase vote count
                }
              : product;
          }),
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderStars = (rating, onClickHandler) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`fa-star ${i <= rating ? "fas" : "far"} ${styles.Star}`}
          onClick={() => onClickHandler(i)}
        />
      );
    }
    return stars;
  };

  return (
    <Card className={`${styles.Product} shadow-sm mb-4`}>
      <Link to={`/products/${id}`}>
        <Card.Img
          src={image}
          alt={name}
          className={`${styles.ProductImage} rounded-top`}
        />
      </Link>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Link to={`/profiles/${profile_id}`} className="text-decoration-none">
            <div className="d-flex align-items-center">
              <Avatar src={profile_image} height={40} />
              <span className="ms-2">{owner}</span>
            </div>
          </Link>
          {is_owner && productPage && (
            <MoreDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
          )}
        </div>

        <Card.Title className={`${styles.ProductName} mb-1`}>{name}</Card.Title>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* User's own rating */}
          <div className={`${styles.RatingContainer}`}>
            <p className="mb-1">Your rating:</p>
            <div className={styles.Star}>
              {renderStars(userVote, handleUserRating)}
            </div>
          </div>

          {/* Average rating and number of users who rated */}
          <div className={`${styles.RatingContainer}`}>
            <p className="mb-1">
              Average rating:{" "}
              {totalVotes > 0
                ? `${averageRating.toFixed(1)} (${totalVotes} ratings)`
                : "No ratings yet"}
            </p>
            <div className={styles.StarAverage}>
              {renderStars(averageRating, () => {})}
            </div>
          </div>
        </div>

        <Card.Text className={`${styles.ProductDescription} mb-2`}>
          {description}
        </Card.Text>

        {/* Flex container for price and category */}
        <div className="d-flex justify-content-center mb-3">
          <p className={`${styles.ProductDetail} me-4`}>
            <strong>Price:</strong> ${price}
          </p>

          <Link to={`/categories/${category}`} className="text-decoration-none">
            <p className={`${styles.ProductDetail} ml-2`}>
              <strong>Category:</strong> {category}
            </p>
          </Link>
        </div>
      </Card.Body>

      <Card.Footer className="d-flex justify-content-between align-items-center p-2">
        <span className="text-muted">{updated_at}</span>
        <Link to={`/products/${id}`}>
          <i className="far fa-comments me-1"></i> {comments_count}
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default Product;
