export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCsrfToken = () => {
  const csrfCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
  return csrfCookie;
};

export const getAuthHeaders = () => {
  const token = getToken();
  const csrfToken = getCsrfToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRFToken": csrfToken,
    },
  };
};
