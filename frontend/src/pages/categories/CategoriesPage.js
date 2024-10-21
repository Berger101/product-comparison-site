import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/CategoriesPage.module.css";

const categories = ["electronics", "clothing", "books", "shoes"];

function CategoriesPage() {
  return (
    <div className={styles.CategoriesPage}>
      <h2>Categories</h2>
      <div className={styles.CategoryList}>
        {categories.map((category) => (
          <Link
            key={category}
            to={`/categories/${category}`}
            className={styles.CategoryItem}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoriesPage;
