import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "../products/Product";
import { Container, Row, Col } from "react-bootstrap";
import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";
import { fetchMoreData } from "../../utils/utils";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll";

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
        // console.log(err);
      }
    };

    fetchData();
  }, [category]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={13} className="py-2 p-0 p-lg-2 m-0">
          <h2 className="text-center mb-4">{categoryTitle}</h2>
          {hasLoaded ? (
            categoryProducts.results.length ? (
              <CustomInfiniteScroll
                dataLength={categoryProducts.results.length}
                next={() =>
                  fetchMoreData(categoryProducts, setCategoryProducts)
                }
                hasMore={!!categoryProducts.next}
                loader={<Asset spinner />}
              >
                <Row className="mt-4">
                  {categoryProducts.results.map((product) => (
                    <Col
                      key={product.id}
                      lg={4}
                      md={6}
                      xs={12}
                      className="mb-4"
                    >
                      <Product {...product} setProducts={setCategoryProducts} />
                    </Col>
                  ))}
                </Row>
              </CustomInfiniteScroll>
            ) : (
              <Asset
                src={NoResults}
                message={`No products found for the category "${categoryTitle}".`}
              />
            )
          ) : (
            <Asset spinner />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CategoryProductsPage;
