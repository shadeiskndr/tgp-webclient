import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingErrorState from "../components/internals/LoadingErrorState";
import DashboardDataFilters from "../components/internals/DashboardDataFilters";
import DashboardDataChart from "../components/internals/DashboardDataChart";
import CountryInsights from "../components/internals/CountryInsights";
import { useEconomicDashboard } from "../hooks/useEconomicDashboard";

export default function Dashboard() {
  // State for countries
  const [country1, setCountry1] = useState<string>("MY");
  const [country2, setCountry2] = useState<string>("US");
  const [country3, setCountry3] = useState<string>("IN");

  // State for selected years
  const [selectedYear1, setSelectedYear1] = useState<number>(2023);
  const [selectedYear2, setSelectedYear2] = useState<number>(2023);
  const [selectedYear3, setSelectedYear3] = useState<number>(2023);

  // Use the custom hook for data fetching
  const {
    country1Data,
    country2Data,
    country3Data,
    availableCountries,
    availableYears,
    loading,
    error,
  } = useEconomicDashboard(country1, country2, country3);

  // Reset filters
  const handleResetFilters = () => {
    setCountry1("MY");
    setCountry2("US");
    setCountry3("IN");

    // Set to most recent year available
    if (availableYears.length > 0) {
      setSelectedYear1(availableYears[0]);
      setSelectedYear2(availableYears[0]);
      setSelectedYear3(availableYears[0]);
    }
  };

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Economic Indicators Comparison Dashboard
      </Typography>

      <LoadingErrorState
        loading={loading && country1Data.length === 0}
        error={error}
      />

      {(!loading || country1Data.length > 0) && !error && (
        <>
          <DashboardDataFilters
            country1={country1}
            country2={country2}
            country3={country3}
            selectedYear1={selectedYear1}
            selectedYear2={selectedYear2}
            selectedYear3={selectedYear3}
            availableCountries={availableCountries}
            availableYears={availableYears}
            onCountry1Change={setCountry1}
            onCountry2Change={setCountry2}
            onCountry3Change={setCountry3}
            onYear1Change={setSelectedYear1}
            onYear2Change={setSelectedYear2}
            onYear3Change={setSelectedYear3}
            onResetFilters={handleResetFilters}
          />

          <DashboardDataChart
            country1={country1}
            country2={country2}
            country3={country3}
            selectedYear1={selectedYear1}
            selectedYear2={selectedYear2}
            selectedYear3={selectedYear3}
            country1Data={country1Data}
            country2Data={country2Data}
            country3Data={country3Data}
            availableCountries={availableCountries}
          />

          <CountryInsights
            country1={country1}
            country2={country2}
            country3={country3}
            selectedYear1={selectedYear1}
            selectedYear2={selectedYear2}
            selectedYear3={selectedYear3}
            country1Data={country1Data}
            country2Data={country2Data}
            country3Data={country3Data}
            availableCountries={availableCountries}
          />
        </>
      )}
    </Box>
  );
}
