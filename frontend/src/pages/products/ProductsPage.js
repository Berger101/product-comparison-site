import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Product from "./Product";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/ProductsPage.module.css";

import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import NoResults from "../../assets/no-results.png";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll";
import { fetchMoreData } from "../../utils/utils";

function ProductsPage({ message, filter = "" }) {
  const [products, setProducts] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosReq.get(
          `/products/?${filter}search=${query}`
        );
        setProducts(data);
        setHasLoaded(true);
      } catch (err) {
        // console.error(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchProducts();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter, query, pathname]);

  return (
    <Container fluid className="px-2">
      <Row className="justify-content-center">
        <Col lg={12}>
          <i className={`fas fa-search ${styles.SearchIcon}`} />
          <Form
            className={styles.SearchBar}
            onSubmit={(event) => event.preventDefault()}
          >
            <Form.Control
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="text"
              placeholder="Search products"
            />
          </Form>

          {hasLoaded ? (
            <>
              {products.results.length ? (
                <CustomInfiniteScroll
                  dataLength={products.results.length}
                  loader={<Asset spinner />}
                  hasMore={!!products.next}
                  next={() => fetchMoreData(products, setProducts)}
                >
                  <Row className="mt-4">
                    {products.results.map((product) => (
                      <Col
                        key={product.id}
                        lg={4} // 3 columns on large screens
                        md={6} // 2 columns on medium screens
                        xs={12} // 1 column on small screens
                        className="mb-4"
                      >
                        <Product {...product} setProducts={setProducts} />
                      </Col>
                    ))}
                  </Row>
                </CustomInfiniteScroll>
              ) : (
                <Container className={appStyles.Content}>
                  <Asset src={NoResults} message={message} />
                </Container>
              )}
            </>
          ) : (
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProductsPage;
