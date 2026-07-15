import { apiConfig } from "../config/apiConfig";
import axios from "axios";

const addAuthInterceptor = (client: ReturnType<typeof axios.create>) => {
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return client;
};

export const authApiClient = addAuthInterceptor(
  axios.create({
    baseURL: apiConfig.authBaseUrl,
  })
);

export const loansApiClient = addAuthInterceptor(
  axios.create({
    baseURL: apiConfig.loansBaseUrl,
  })
);

export const integrationApiClient = addAuthInterceptor(
  axios.create({
    baseURL: apiConfig.IntegrationBaseURL,
  })
);