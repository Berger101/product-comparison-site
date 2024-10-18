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
    features,
    keywords,
    location,
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
        <Card.Img src={image} alt={name} />
      </Link>
      <Card.Body>
        {name && <Card.Title className="text-center">{name}</Card.Title>}
        {description && <Card.Text>{description}</Card.Text>}
        {price && <p>Price: ${price}</p>}
        {category && <p>Category: {category}</p>}
        {features && <p>Features: {features}</p>}
        {keywords && <p>Keywords: {keywords}</p>}
        {location && <p>Location: {location}</p>}

        {/* User's own rating */}
        <div className={styles.RatingContainer}>
          <p>Your rating:</p>
          <div className={styles.Stars}>
            {renderStars(userVote, handleUserRating)}
          </div>
        </div>

        {/* Average rating and number of users who rated */}
        <div className={styles.RatingContainer}>
          <p>
            Average rating:{" "}
            {totalVotes > 0
              ? `${averageRating.toFixed(1)} (${totalVotes} ratings)`
              : "No ratings yet"}
          </p>
          <div className={styles.Stars}>
            {renderStars(averageRating, () => {})}
          </div>
        </div>

        <div className={styles.ProductBar}>
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
