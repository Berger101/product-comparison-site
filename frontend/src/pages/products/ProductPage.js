import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "./Product";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import { getAuthHeaders } from "../../utils/tokenUtils";
import { useSetFavoritesData } from "../../contexts/FavoriteDataContext";
import btnStyles from "../../styles/Button.module.css";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  // Get favorite functions from the context
  const { handleFavorite, handleUnfavorite } = useSetFavoritesData();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: product }, { data: comments }] = await Promise.all([
          axiosReq.get(`/products/${id}`),
          axiosReq.get(`/comments/?product=${id}`),
        ]);
        setProduct({ results: [product] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  // Function to handle favorite/unfavorite click
  const handleFavoriteClick = async () => {
    try {
      const productId = product.results[0]?.id;

      if (!productId) {
        console.error("Product ID is undefined");
        return;
      }

      if (product.results[0]?.is_favorited) {
        const favoriteId = product.results[0]?.favorite_id;
        if (!favoriteId) {
          console.error("Favorite ID is undefined");
          return;
        }

        await handleUnfavorite(productId, favoriteId);
        setProduct((prevState) => ({
          ...prevState,
          results: [
            { ...prevState.results[0], is_favorited: false, favorite_id: null },
          ],
        }));
      } else {
        const data = await handleFavorite(productId);
        if (data && data.id) {
          setProduct((prevState) => ({
            ...prevState,
            results: [
              {
                ...prevState.results[0],
                is_favorited: true,
                favorite_id: data.id,
              },
            ],
          }));
        } else {
          console.error("No data returned from the backend when favoriting.");
        }
      }
    } catch (err) {
      console.error("Error favoriting/unfavoriting product:", err);
    }
  };

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Product {...product.results[0]} setProducts={setProduct} productPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              product={id}
              setProduct={setProduct}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setProduct={setProduct}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
        <Col className="text-center mt-3">
          {currentUser && (
            <Button
              className={`${btnStyles.Button} ${
                product.results[0]?.is_favorited
                  ? btnStyles.BlackOutline
                  : btnStyles.Black
              }`}
              onClick={handleFavoriteClick}
            >
              {product.results[0]?.is_favorited ? "Unfavorite" : "Favorite"}
            </Button>
          )}
        </Col>
      </Col>
    </Row>
  );
}

export default ProductPage;
