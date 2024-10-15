import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import ProductCreateForm from "./pages/products/ProductCreateForm";
import ProductPage from "./pages/products/ProductPage";
import ProductsPage from "./pages/products/ProductsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProductEditForm from "./pages/products/ProductEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

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

          <Route
            path="/feed"
            element={
              <ProductsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            }
          />

          <Route
            path="/liked"
            element={
              <ProductsPage
                message="No results found. Adjust the search keyword or like a product."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            }
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
    </div>
  );
}

export default App;
