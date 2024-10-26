import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams, useNavigate } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useFavoritesData,
  useSetFavoritesData,
} from "../../contexts/FavoriteDataContext";
import { Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Product from "../products/Product";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { getAuthHeaders } from "../../utils/tokenUtils";
import FavoriteProducts from "../profiles/FavoriteProducts";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileProducts, setProfileProducts] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { id } = useParams();

  const { setFavoriteData } = useSetFavoritesData();
  const { pageProfile } = useFavoritesData();

  const [profile] = pageProfile.results;

  useEffect(() => {
    const fetchData = async (profileId) => {
      try {
        const config = getAuthHeaders();

        const [{ data: pageProfile }, { data: profileProducts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${profileId}/`, config),
            axiosReq.get(`/products/?owner__profile=${profileId}`, config),
          ]);

        setFavoriteData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileProducts(profileProducts);
        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    // If current user's profile ID does not match the URL ID, redirect and fetch their profile data
    if (currentUser?.profile_id && currentUser.profile_id !== Number(id)) {
      navigate(`/profiles/${currentUser.profile_id}`);
      fetchData(currentUser.profile_id); // Fetch the correct profile data after redirection
    } else if (currentUser?.profile_id === Number(id)) {
      fetchData(id); // Fetch data only if IDs match
    }
  }, [id, setFavoriteData, currentUser, navigate]);

  // Render the profile and product components as before
  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center">
            <Col xs={3} className="my-2">
              <div>{profile?.products_count}</div>
              <div>Products</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.favorites_count}</div>
              <div>Favorite</div>
            </Col>
          </Row>
        </Col>
      </Row>
      {profile?.content && (
        <Col className="p-3 text-center">{profile.content}</Col>
      )}
    </>
  );

  const mainProfileProducts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s products</p>
      <hr />
      {profileProducts.results.length ? (
        <InfiniteScroll
          children={profileProducts.results.map((product) => (
            <Product
              key={product.id}
              {...product}
              setProducts={setProfileProducts}
            />
          ))}
          dataLength={profileProducts.results.length}
          loader={<Asset spinner />}
          hasMore={!!profileProducts.next}
          next={() => fetchMoreData(profileProducts, setProfileProducts)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't posted any products yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileProducts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <FavoriteProducts />
      </Col>
    </Row>
  );
}

export default ProfilePage;
