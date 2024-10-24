import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import { Link } from "react-router-dom";
import { useFavoritesData } from "../../contexts/FavoriteDataContext";

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
                const product = favorite.product || favorite;

                return (
                  <div key={product.id} className="product-card mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                    />
                    <div className="mt-2">
                      <h5>{product.name}</h5>
                      <p>Price: ${product.price}</p>
                      <p>Category: {product.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            favoriteProducts.results.map((favorite) => {
              const product = favorite.product || favorite;

              return (
                <div key={product.id} className="product-card mb-3 p-2 border rounded">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="img-fluid"
                    />
                  </Link>
                  <div className="mt-2">
                    <h5 className="text-center">{product.name}</h5>
                    <p>Price: ${product.price}</p>
                    <p>
                      Category:{" "}
                      <Link
                        to={`/categories/${product.category}`}
                        className="text-decoration-none"
                      >
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </Link>
                    </p>
                  </div>
                </div>
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
