import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Product from "../products/Product";
import styles from "../../styles/CategoryProductsPage.module.css";

function CategoryProductsPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosReq.get(`/products/?category=${category}`);
        setProducts(data.results);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className={styles.CategoryProductsPage}>
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div className={styles.ProductList}>
        {products.length > 0 ? (
          products.map((product) => (
            <Product key={product.id} {...product} setProducts={setProducts} />
          ))
        ) : (
          <p>No products found for this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryProductsPage;
