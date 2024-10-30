import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
  useFavoritesData,
  useSetFavoritesData,
} from "../../contexts/FavoriteDataContext";
import { Image } from "react-bootstrap";
import CustomInfiniteScroll from "../../components/CustomInfiniteScroll";
import Product from "../products/Product";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { getAuthHeaders } from "../../utils/tokenUtils";
import FavoriteProducts from "../profiles/FavoriteProducts";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileProducts, setProfileProducts] = useState({ results: [] });

  const { id } = useParams();

  const { setFavoriteData } = useSetFavoritesData();
  const { pageProfile } = useFavoritesData();

  const [profile] = pageProfile.results;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthHeaders();

        const [{ data: pageProfile }, { data: profileProducts }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`, config),
            axiosReq.get(`/products/?owner__profile=${id}`, config),
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

    fetchData();
  }, [id, setFavoriteData]);

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
        <CustomInfiniteScroll
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

      {/* Sidebar for large screens */}
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <FavoriteProducts />
      </Col>

      {/* Favorite products below profile for tablet and mobile screens */}
      <Col xs={13} className="d-lg-none mt-3">
        <FavoriteProducts />
      </Col>
    </Row>
  );
}

export default ProfilePage;
