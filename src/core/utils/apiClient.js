import axios from "axios";
import { Endpoints } from "./endpoints";
export const apiClient = axios.create({
  baseURL: Endpoints.baseUrl
  ,
  timeout: 3000,
});
apiClient.defaults.withCredentials = true;
export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem("refreshToken");
};
export const addRefreshTokenToLocalStorage = (refreshToken) => {
  return localStorage.setItem("refreshToken", refreshToken);
};
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};
export const addTokenToLocalStorage = (token) => {
  return localStorage.setItem("token", token);
};
const refreshToken = async () => {
  try {
    console.log("######## REFRESH TOKEN");

    const resp = await apiClient.get("auth/refresh");
    console.log("############ REFRESH TOKEN RESPONSE", resp);

    return resp.data;
  } catch (e) {
    console.log("Error", e);
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const resp = await refreshToken();

      // const access_token = resp?.response?.token;
      const access_token = resp?.token || resp?.data?.token;


      if (access_token) {
        addTokenToLocalStorage(access_token);
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
