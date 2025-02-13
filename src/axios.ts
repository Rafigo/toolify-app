/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

// Types pour les réponses API
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type pour les erreurs API
interface ApiError {
  message: string;
  status: number;
  errors?: any;
}

// Création de l'instance axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupération du token depuis le localStorage
    /* const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } */
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    // Gestion des erreurs spécifiques
    if (response) {
      switch (response.status) {
        case 401:
          // Non autorisé - Redirection vers la page de connexion
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          // Accès interdit
          window.location.href = "/forbidden";
          break;
        case 404:
          // Ressource non trouvée
          window.location.href = "/not-found";
          break;
        case 500:
          // Erreur serveur
          window.location.href = "/server-error";
          break;
      }
    }

    return Promise.reject(error);
  }
);

// Méthodes d'API typées
export const api = {
  get: async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  put: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Fonction utilitaire pour gérer les erreurs
const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || "Une erreur est survenue",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
  return {
    message: "Une erreur inattendue est survenue",
    status: 500,
  };
};

export default api;
