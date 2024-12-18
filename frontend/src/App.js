import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import ProductCreateForm from "./pages/products/ProductCreateForm";
import ProductPage from "./pages/products/ProductPage";
import ProductsPage from "./pages/products/ProductsPage";
// import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProductEditForm from "./pages/products/ProductEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import CategoriesPage from "./pages/categories/CategoriesPage";
import CategoryProductsPage from "./pages/categories/CategoryProductsPage";

function App() {
  // const currentUser = useCurrentUser();
  // const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Routes>
          <Route
            path="/"
            element={
              <ProductsPage message="No results found. Adjust the search keyword." />
            }
          />

          <Route path="/categories" element={<CategoriesPage />} />
          <Route
            path="/categories/:category"
            element={<CategoryProductsPage />}
          />

          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/products/create" element={<ProductCreateForm />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/products/:id/edit" element={<ProductEditForm />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />

          <Route
            path="/profiles/:id/edit/username"
            element={<UsernameForm />}
          />
          <Route
            path="/profiles/:id/edit/password"
            element={<UserPasswordForm />}
          />
          <Route path="/profiles/:id/edit" element={<ProfileEditForm />} />

          <Route path="*" element={<p>Page not found!</p>} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
