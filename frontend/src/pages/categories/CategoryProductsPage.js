import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "../products/Product";
import styles from "../../styles/CategoryProductsPage.module.css";
import { Container, Col } from "react-bootstrap";
import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

function CategoryProductsPage() {
  const { category } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [categoryProducts, setCategoryProducts] = useState({ results: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosReq.get(`/products/?category=${category}`);
        setCategoryProducts(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [category]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <Container className={`${styles.CategoryProductsPage}`}>
      <h2 className="text-center mb-4">{categoryTitle}</h2>
      {hasLoaded ? (
        categoryProducts.results.length ? (
          <InfiniteScroll
            className="row" // Bootstrap's row class for grid alignment
            dataLength={categoryProducts.results.length}
            loader={<Asset spinner />}
            hasMore={!!categoryProducts.next}
            next={() => fetchMoreData(categoryProducts, setCategoryProducts)}
          >
            {categoryProducts.results.map((product) => (
              <Col
                key={product.id}
                xs={12} // Full width on mobile
                md={6} // Two columns on medium and larger screens
                className="mb-4"
              >
                <Product {...product} setProducts={setCategoryProducts} />
              </Col>
            ))}
          </InfiniteScroll>
        ) : (
          <Asset
            src={NoResults}
            message={`No products found for the category "${categoryTitle}".`}
          />
        )
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
}

export default CategoryProductsPage;
