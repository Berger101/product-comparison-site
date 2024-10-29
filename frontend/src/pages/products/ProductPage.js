import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "./Product";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import { getAuthHeaders } from "../../utils/tokenUtils";
import FavoriteProducts from "../profiles/FavoriteProducts";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const config = getAuthHeaders();
        const [{ data: productData }, { data: commentsData }] =
          await Promise.all([
            axiosReq.get(`/products/${id}`, config),
            axiosReq.get(`/comments/?product=${id}`, config),
          ]);

        setProduct({ results: [productData] });
        setComments(commentsData);
      } catch (err) {
        // console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {product.results.length ? ( // Check if product data exists
          <Product
            {...product.results[0]}
            setProducts={setProduct}
            productPage
          />
        ) : (
          <Asset spinner /> // Show loading if product is undefined
        )}
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
            <CustomInfiniteScroll
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
      </Col>

      {/* Sidebar for large screens to show Favorite Products */}
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <FavoriteProducts />
      </Col>

      {/* Favorite products below for tablet and mobile screens */}
      <Col xs={12} className="d-lg-none mt-3">
        <FavoriteProducts />
      </Col>
    </Row>
  );
}

export default ProductPage;
