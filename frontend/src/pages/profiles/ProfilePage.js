import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useFavoritesData, useSetFavoritesData } from "../../contexts/FavoriteDataContext";
import { Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Product from "../products/Product";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import { getAuthHeaders } from "../../utils/tokenUtils";

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileProducts, setProfileProducts] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setFavoriteData } = useSetFavoritesData();
  const { pageProfile } = useFavoritesData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = getAuthHeaders();

        const [{ data: pageProfile }, { data: profileProducts }] = await Promise.all([
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

  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image className={styles.ProfileImage} roundedCircle src={profile?.image} />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center">
            <Col xs={3} className="my-2">
              <div>{profile?.products_count}</div>
              <div>products</div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );

  const mainProfileProducts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s products</p> <hr />
      {profileProducts.results.length ? (
        <InfiniteScroll
          children={profileProducts.results.map((product) => (
            <Product key={product.id} {...product} setProducts={setProfileProducts} />
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
    </Row>
  );
}

export default ProfilePage;
