import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "../products/Product";
import { Container, Row, Col } from "react-bootstrap";
import Asset from "../../components/Asset";
import NoResults from "../../assets/no-results.png";

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
        <Col lg={8} className="py-2 p-0 p-lg-2 m-0">
          <h2 className="text-center mb-4">{categoryTitle}</h2>
          {hasLoaded ? (
            categoryProducts.results.length ? (
              categoryProducts.results.map((product) => (
                <Row key={product.id} className="mb-4">
                  <Col className="py-0 p-0 p-lg-2 m-0">
                    <Product {...product} setProducts={setCategoryProducts} />
                  </Col>
                </Row>
              ))
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
