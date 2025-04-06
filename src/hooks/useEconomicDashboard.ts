import { useState, useEffect } from "react";
import EconomicDataService, {
  EconomicDataResponse,
  EconomicDataItem,
} from "../services/economic-data.service";

// Define types for dashboard data
export interface CountryData {
  gdp: number | null;
  population: number | null;
  education: number | null;
  inflation: number | null;
  labour: number | null;
  year: number;
}

interface AllEconomicData {
  gdp: EconomicDataResponse<EconomicDataItem>;
  populationGrowth: EconomicDataResponse<EconomicDataItem>;
  educationExpenditure: EconomicDataResponse<EconomicDataItem>;
  inflation: EconomicDataResponse<EconomicDataItem>;
  labourForce: EconomicDataResponse<EconomicDataItem>;
}

export interface DashboardState {
  country1Data: CountryData[];
  country2Data: CountryData[];
  country3Data: CountryData[];
  availableCountries: { code: string; name: string }[];
  availableYears: number[];
  loading: boolean;
  error: string | null;
}

export const useEconomicDashboard = (
  country1: string,
  country2: string,
  country3: string
) => {
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    country1Data: [],
    country2Data: [],
    country3Data: [],
    availableCountries: [],
    availableYears: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDashboardState((prev) => ({ ...prev, loading: true }));

        // Fetch all data for all three countries
        const [country1Response, country2Response, country3Response] =
          await Promise.all([
            EconomicDataService.getAllEconomicData(country1),
            EconomicDataService.getAllEconomicData(country2),
            EconomicDataService.getAllEconomicData(country3),
          ]);

        let countries = dashboardState.availableCountries;
        let years = dashboardState.availableYears;

        // Extract unique countries from the data for the dropdown if not already populated
        if (countries.length === 0) {
          // Combine all country data to extract unique countries
          const allGdpData = [
            ...country1Response.gdp.data,
            ...country2Response.gdp.data,
            ...country3Response.gdp.data,
          ];

          countries = allGdpData.reduce(
            (acc: { code: string; name: string }[], item) => {
              if (!acc.some((c) => c.code === item.iso_code)) {
                acc.push({ code: item.iso_code, name: item.country_name });
              }
              return acc;
            },
            []
          );

          // Extract available years
          const yearSet = new Set<number>();
          allGdpData.forEach((item: EconomicDataItem) =>
            yearSet.add(item.year)
          );
          years = Array.from(yearSet).sort((a, b) => b - a); // Sort descending
        }

        // Process data for all countries
        const processedData1 = processCountryData(country1Response);
        const processedData2 = processCountryData(country2Response);
        const processedData3 = processCountryData(country3Response);

        setDashboardState({
          country1Data: processedData1,
          country2Data: processedData2,
          country3Data: processedData3,
          availableCountries: countries,
          availableYears: years,
          loading: false,
          error: null,
        });
      } catch (err) {
        setDashboardState((prev) => ({
          ...prev,
          error: "Failed to load economic data",
          loading: false,
        }));
        console.error(err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country1, country2, country3]);

  // Process the raw API data into a format suitable for visualization
  const processCountryData = (data: AllEconomicData): CountryData[] => {
    // Get all unique years across all datasets
    const allYears = new Set<number>();

    data.gdp.data.forEach((item: EconomicDataItem) => {
      allYears.add(item.year);
    });

    data.populationGrowth.data.forEach((item: EconomicDataItem) => {
      allYears.add(item.year);
    });

    data.educationExpenditure.data.forEach((item: EconomicDataItem) => {
      allYears.add(item.year);
    });

    data.inflation.data.forEach((item: EconomicDataItem) => {
      allYears.add(item.year);
    });

    data.labourForce.data.forEach((item: EconomicDataItem) => {
      allYears.add(item.year);
    });

    // Create an array of years sorted in ascending order
    const years = Array.from(allYears).sort((a, b) => a - b);

    // Map each year to a data object
    return years.map((year) => {
      const gdpItem = data.gdp.data.find(
        (item: EconomicDataItem) => item.year === year
      );
      const populationItem = data.populationGrowth.data.find(
        (item: EconomicDataItem) => item.year === year
      );
      const educationItem = data.educationExpenditure.data.find(
        (item: EconomicDataItem) => item.year === year
      );
      const inflationItem = data.inflation.data.find(
        (item: EconomicDataItem) => item.year === year
      );
      const labourItem = data.labourForce.data.find(
        (item: EconomicDataItem) => item.year === year
      );

      return {
        year,
        gdp: gdpItem ? gdpItem.value : null,
        population: populationItem ? populationItem.value : null,
        education: educationItem ? educationItem.value : null,
        inflation: inflationItem ? inflationItem.value : null,
        labour: labourItem ? labourItem.value : null,
      };
    });
  };

  return dashboardState;
};

// Helpers for formatting and data analysis
export const getValueForYear = (
  data: CountryData[],
  indicator: keyof CountryData,
  year: number
): string => {
  const yearData = data.find((d) => d.year === year);
  if (!yearData) return "N/A";

  const value = yearData[indicator];
  if (value === null || value === undefined) return "N/A";

  return typeof value === "number" ? value.toFixed(2) : String(value);
};

export const formatNumber = (value: string | number): string => {
  if (value === "N/A") return value;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString();
};
