import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
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
              {favoriteProducts.results.slice(0, 4).map((favorite) => {
                // Access product details based on API response structure
                const product = favorite.product || favorite; // Adjust if necessary

                return (
                  <Product
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    category={product.category}
                    mobile
                  />
                );
              })}
            </div>
          ) : (
            favoriteProducts.results.map((favorite) => {
              // Access product details based on API response structure
              const product = favorite.product || favorite; // Adjust if necessary

              return (
                <Product
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  category={product.category}
                />
              );
            })
          )}
        </>
      ) : (
        <div className="text-center">
          <p>No favorite products yet.</p>
        </div>
      )}
    </Container>
  );
};

export default FavoriteProducts;
