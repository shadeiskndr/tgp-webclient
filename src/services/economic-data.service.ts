import axios from "axios";
import apiClient from "./api.service";

// Define types for the API responses
export interface GDPData {
  id: number;
  year: number;
  gdp_growth_rate: number;
  country_name: string;
  iso_code: string;
}

export interface PopulationGrowthData {
  id: number;
  year: number;
  population_growth_rate: number;
  country_name: string;
  iso_code: string;
}

export interface EducationExpenditureData {
  id: number;
  year: number;
  expenditure_percentage: number;
  country_name: string;
  iso_code: string;
}

export interface InflationData {
  id: number;
  year: number;
  inflation_rate: number;
  country_name: string;
  iso_code: string;
}

export interface LabourForceData {
  id: number;
  year: number;
  labour_force_total: number;
  country_name: string;
  iso_code: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// Create a separate instance for login requests (without auth headers)
const authClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Economic data service
const EconomicDataService = {
  // Login function - uses authClient without token
  login: async (username: string, password: string) => {
    const response = await authClient.post<LoginResponse>("/login", {
      username,
      password,
    });
    return response.data;
  },

  // GDP data - uses apiClient with token
  getGDP: async (country?: string) => {
    const params = country ? { country } : {};
    const response = await apiClient.get<{ gdp: GDPData[] }>("/gdp", {
      params,
    });
    return response.data;
  },

  // Population growth data
  getPopulationGrowth: async (country?: string) => {
    const params = country ? { country } : {};
    const response = await apiClient.get<{
      population: PopulationGrowthData[];
    }>("/population_growth", { params });
    return response.data;
  },

  // Education expenditure data
  getEducationExpenditure: async (country?: string) => {
    const params = country ? { country } : {};
    const response = await apiClient.get<{
      education_expenditure: EducationExpenditureData[];
    }>("/education_expenditure", { params });
    return response.data;
  },

  // Inflation data
  getInflation: async (country?: string) => {
    const params = country ? { country } : {};
    const response = await apiClient.get<{ inflation: InflationData[] }>(
      "/inflation",
      { params }
    );
    return response.data;
  },

  // Labour force data
  getLabourForce: async (country?: string) => {
    const params = country ? { country } : {};
    const response = await apiClient.get<{ labour_force: LabourForceData[] }>(
      "/labour_force",
      { params }
    );
    return response.data;
  },

  // Get all economic data for a country
  getAllEconomicData: async (country?: string) => {
    const params = country ? { country } : {};

    const [gdpData, populationData, educationData, inflationData, labourData] =
      await Promise.all([
        apiClient.get("/gdp", { params }),
        apiClient.get("/population_growth", { params }),
        apiClient.get("/education_expenditure", { params }),
        apiClient.get("/inflation", { params }),
        apiClient.get("/labour_force", { params }),
      ]);

    return {
      gdp: gdpData.data,
      populationGrowth: populationData.data,
      educationExpenditure: educationData.data,
      inflation: inflationData.data,
      labourForce: labourData.data,
    };
  },
};

export default EconomicDataService;
