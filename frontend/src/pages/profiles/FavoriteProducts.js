import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useFavoritesData } from "../../contexts/FavoriteDataContext";
import Product from "../products/Product";

const FavoriteProducts = ({ mobile }) => {
  const { favoriteProducts } = useFavoritesData();

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {favoriteProducts.results.length ? (
        <>
          <p>Your favorite products:</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {favoriteProducts.results.slice(0, 4).map((product) => (
                <Product key={product.id} product={product} mobile />
              ))}
            </div>
          ) : (
            favoriteProducts.results.map((product) => (
              <Product key={product.id} product={product} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default FavoriteProducts;
