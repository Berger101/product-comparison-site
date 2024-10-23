import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const favoriteHelper = (product, clickedProduct, favorite_id) => {
  return product.id === clickedProduct.id
    ? // This is the product the user clicked on,
      // update its favorites count and set its favorite id
      {
        ...product,
        favorites_count: product.favorites_count + 1,
        favorite_id,
      }
    : product;
};

export const unfavoriteHelper = (product, clickedProduct) => {
  return product.id === clickedProduct.id
    ? // This is the product the user clicked on,
      // update its favorites count and remove its favorite id
      {
        ...product,
        favorites_count: product.favorites_count - 1,
        favorite_id: null,
      }
    : product;
};
