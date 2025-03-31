import axios from "axios";
import apiClient from "./api.service";

// Data category enum (matches backend)
export enum DataCategory {
  GDP = "gdp",
  POPULATION = "population",
  EDUCATION = "education",
  INFLATION = "inflation",
  LABOUR = "labour",
}

// Common data response interface matching API response
export interface EconomicDataResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// Generic economic data item
export interface EconomicDataItem {
  id: number;
  year: number;
  value: number;
  country_name: string;
  iso_code: string;
}

export interface Country {
  code: string;
  name: string;
}

// Auth interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_at: number;
}

export interface UserInfo {
  username: string;
}

interface EconomicDataParams {
  country?: string;
  year?: number;
  yearFrom?: number; // Add year range support
  yearTo?: number; // Add year range support
  limit?: number;
  offset?: number;
}

// Create a separate instance for login requests (without auth headers)
const authClient = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Economic data service
const EconomicDataService = {
  // Auth functions
  login: async (username: string, password: string) => {
    const response = await authClient.post<LoginResponse>("/login", {
      username,
      password,
    });

    // Store token and expiration time
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("token_expires", response.data.expires_at.toString());

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expires");
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<UserInfo>("/auth/me");
    return response.data;
  },

  getCountries: async () => {
    const response = await apiClient.get<EconomicDataResponse<Country>>(
      "/data/countries"
    );
    return response.data.data;
  },

  // Economic data functions - use standardized data fetching
  getEconomicData: async (
    category: DataCategory,
    params?: EconomicDataParams
  ) => {
    const response = await apiClient.get<
      EconomicDataResponse<EconomicDataItem>
    >(`/data/${category}`, {
      params: {
        country: params?.country,
        year: params?.year,
        year_from: params?.yearFrom,
        year_to: params?.yearTo,
        limit: params?.limit,
        offset: params?.offset,
      },
    });
    return response.data;
  },

  // Convenience methods for specific data types
  getGDP: async (params?: EconomicDataParams) => {
    return EconomicDataService.getEconomicData(DataCategory.GDP, params);
  },

  getPopulationGrowth: async (params?: EconomicDataParams) => {
    return EconomicDataService.getEconomicData(DataCategory.POPULATION, params);
  },

  getEducationExpenditure: async (params?: EconomicDataParams) => {
    return EconomicDataService.getEconomicData(DataCategory.EDUCATION, params);
  },

  getInflation: async (params?: EconomicDataParams) => {
    return EconomicDataService.getEconomicData(DataCategory.INFLATION, params);
  },

  getLabourForce: async (params?: EconomicDataParams) => {
    return EconomicDataService.getEconomicData(DataCategory.LABOUR, params);
  },

  // Get all economic data for a country (batched requests)
  getAllEconomicData: async (country?: string, year?: number) => {
    const params = { country, year };

    const [gdpData, populationData, educationData, inflationData, labourData] =
      await Promise.all([
        EconomicDataService.getGDP(params),
        EconomicDataService.getPopulationGrowth(params),
        EconomicDataService.getEducationExpenditure(params),
        EconomicDataService.getInflation(params),
        EconomicDataService.getLabourForce(params),
      ]);

    return {
      gdp: gdpData,
      populationGrowth: populationData,
      educationExpenditure: educationData,
      inflation: inflationData,
      labourForce: labourData,
    };
  },

  // Health check
  healthCheck: async () => {
    // Using axios directly as this doesn't need auth
    const response = await axios.get("/health");
    return response.data;
  },
};

export default EconomicDataService;
