import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { BarChart } from "@mui/x-charts/BarChart";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import EconomicDataService from "../services/economic-data.service";
import { LinearProgress, Stack } from "@mui/material";

// Define a type for the combined data
interface CountryData {
  gdp: number | null;
  population: number | null;
  education: number | null;
  inflation: number | null;
  labour: number | null;
  year: number;
}

export default function Dashboard() {
  // State for countries
  const [country1, setCountry1] = useState<string>("MY");
  const [country2, setCountry2] = useState<string>("US");
  const [country3, setCountry3] = useState<string>("IN");

  // State for selected years
  const [selectedYear1, setSelectedYear1] = useState<number>(2023);
  const [selectedYear2, setSelectedYear2] = useState<number>(2023);
  const [selectedYear3, setSelectedYear3] = useState<number>(2023);

  // State for available countries and years
  const [availableCountries, setAvailableCountries] = useState<
    { code: string; name: string }[]
  >([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // State for data
  const [country1Data, setCountry1Data] = useState<CountryData[]>([]);
  const [country2Data, setCountry2Data] = useState<CountryData[]>([]);
  const [country3Data, setCountry3Data] = useState<CountryData[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount and when countries change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all data for all three countries
        const [country1Response, country2Response, country3Response] =
          await Promise.all([
            EconomicDataService.getAllEconomicData(country1),
            EconomicDataService.getAllEconomicData(country2),
            EconomicDataService.getAllEconomicData(country3),
          ]);

        // Extract unique countries from the data for the dropdown
        if (availableCountries.length === 0) {
          // Combine all country data to extract unique countries
          const allGdpData = [
            ...country1Response.gdp.gdp,
            ...country2Response.gdp.gdp,
            ...country3Response.gdp.gdp,
          ];

          const countries = allGdpData.reduce(
            (acc: { code: string; name: string }[], item) => {
              if (!acc.some((c) => c.code === item.iso_code)) {
                acc.push({ code: item.iso_code, name: item.country_name });
              }
              return acc;
            },
            []
          );
          setAvailableCountries(countries);

          // Extract available years
          const years = new Set<number>();
          allGdpData.forEach((item: any) => years.add(item.year));
          setAvailableYears(Array.from(years).sort((a, b) => b - a)); // Sort descending
        }

        // Process data for all countries
        const processedData1 = processCountryData(country1Response);
        const processedData2 = processCountryData(country2Response);
        const processedData3 = processCountryData(country3Response);

        setCountry1Data(processedData1);
        setCountry2Data(processedData2);
        setCountry3Data(processedData3);
      } catch (err) {
        setError("Failed to load economic data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country1, country2, country3]);

  // Process the raw API data into a format suitable for visualization
  const processCountryData = (data: any): CountryData[] => {
    // Get all unique years across all datasets
    const allYears = new Set<number>();

    data.gdp.gdp.forEach((item: any) => {
      allYears.add(item.year);
    });

    data.populationGrowth.population.forEach((item: any) => {
      allYears.add(item.year);
    });

    data.educationExpenditure.education_expenditure.forEach((item: any) => {
      allYears.add(item.year);
    });

    data.inflation.inflation.forEach((item: any) => {
      allYears.add(item.year);
    });

    data.labourForce.labour_force.forEach((item: any) => {
      allYears.add(item.year);
    });

    // Create an array of years sorted in ascending order
    const years = Array.from(allYears).sort((a, b) => a - b);

    // Map each year to a data object
    return years.map((year) => {
      const gdpItem = data.gdp.gdp.find((item: any) => item.year === year);
      const populationItem = data.populationGrowth.population.find(
        (item: any) => item.year === year
      );
      const educationItem =
        data.educationExpenditure.education_expenditure.find(
          (item: any) => item.year === year
        );
      const inflationItem = data.inflation.inflation.find(
        (item: any) => item.year === year
      );
      const labourItem = data.labourForce.labour_force.find(
        (item: any) => item.year === year
      );

      return {
        year,
        gdp: gdpItem ? gdpItem.gdp_growth_rate : null,
        population: populationItem
          ? populationItem.population_growth_rate
          : null,
        education: educationItem ? educationItem.expenditure_percentage : null,
        inflation: inflationItem ? inflationItem.inflation_rate : null,
        labour: labourItem ? labourItem.labour_force_total : null,
      };
    });
  };

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

  // Add this function to render the labor force comparison chart
  const renderLabourForceComparison = () => {
    // Get data for selected years
    const country1Selected = country1Data.find(
      (d) => d.year === selectedYear1
    ) || {
      labour: 0,
      year: selectedYear1,
    };

    const country2Selected = country2Data.find(
      (d) => d.year === selectedYear2
    ) || {
      labour: 0,
      year: selectedYear2,
    };

    const country3Selected = country3Data.find(
      (d) => d.year === selectedYear3
    ) || {
      labour: 0,
      year: selectedYear3,
    };

    // Find country names
    const country1Name =
      availableCountries.find((c) => c.code === country1)?.name || country1;
    const country2Name =
      availableCountries.find((c) => c.code === country2)?.name || country2;
    const country3Name =
      availableCountries.find((c) => c.code === country3)?.name || country3;

    // Find the maximum labor force value for percentage calculation
    const maxLabour = Math.max(
      country1Selected.labour || 0,
      country2Selected.labour || 0,
      country3Selected.labour || 0
    );

    // Calculate percentages of the maximum value
    const getPercentage = (value: number | null) => {
      if (!value || maxLabour === 0) return 0;
      return (value / maxLabour) * 100;
    };

    // Format large numbers with commas and abbreviations
    const formatLabourForce = (value: number | null) => {
      if (!value) return "N/A";

      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)}B`;
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(2)}K`;
      }

      return value.toLocaleString();
    };

    // Define colors for each country
    const colors = [
      "hsl(120, 40%, 55%)", // Green for country 1
      "hsl(200, 70%, 55%)", // Blue for country 2
      "hsl(0, 60%, 60%)", // Red for country 3
    ];

    // Create data array for the countries
    const labourForceData = [
      {
        name: country1Name,
        value: getPercentage(country1Selected.labour),
        actualValue: country1Selected.labour,
        year: selectedYear1,
        color: colors[0],
      },
      {
        name: country2Name,
        value: getPercentage(country2Selected.labour),
        actualValue: country2Selected.labour,
        year: selectedYear2,
        color: colors[1],
      },
      {
        name: country3Name,
        value: getPercentage(country3Selected.labour),
        actualValue: country3Selected.labour,
        year: selectedYear3,
        color: colors[2],
      },
    ];

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center" }}>
          Labor Force Total Comparison
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
            Total labor force by country for selected years
          </Typography>

          {labourForceData.map((country, index) => (
            <Stack
              key={index}
              direction="row"
              sx={{ alignItems: "center", gap: 2, pb: index < 2 ? 3 : 1 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: country.color,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {country.name.charAt(0)}
              </Box>
              <Stack sx={{ gap: 1, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "500" }}>
                    {country.name} ({country.year})
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {formatLabourForce(country.actualValue)}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  aria-label={`Labor force for ${country.name}`}
                  value={country.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    [`& .MuiLinearProgress-bar`]: {
                      backgroundColor: country.color,
                    },
                  }}
                />
              </Stack>
            </Stack>
          ))}

          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, color: "text.secondary" }}
          >
            * Bar lengths represent relative proportions of the maximum value
          </Typography>
        </Paper>
      </Box>
    );
  };

  // Render the indicator comparison chart (bar chart)
  const renderIndicatorComparison = () => {
    // Get data for selected years
    const country1Selected = country1Data.find(
      (d) => d.year === selectedYear1
    ) || {
      gdp: 0,
      population: 0,
      education: 0,
      inflation: 0,
      labour: 0,
      year: selectedYear1,
    };

    const country2Selected = country2Data.find(
      (d) => d.year === selectedYear2
    ) || {
      gdp: 0,
      population: 0,
      education: 0,
      inflation: 0,
      labour: 0,
      year: selectedYear2,
    };

    const country3Selected = country3Data.find(
      (d) => d.year === selectedYear3
    ) || {
      gdp: 0,
      population: 0,
      education: 0,
      inflation: 0,
      labour: 0,
      year: selectedYear3,
    };

    // Find country names
    const country1Name =
      availableCountries.find((c) => c.code === country1)?.name || country1;
    const country2Name =
      availableCountries.find((c) => c.code === country2)?.name || country2;
    const country3Name =
      availableCountries.find((c) => c.code === country3)?.name || country3;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, textAlign: "center" }}>
          Economic Indicators Comparison
        </Typography>
        <Box sx={{ height: 400 }}>
          <BarChart
            series={[
              {
                data: [
                  country1Selected.gdp || 0,
                  country1Selected.population || 0,
                  country1Selected.education || 0,
                  country1Selected.inflation || 0,
                ],
                label: `${country1Name} (${selectedYear1})`,
              },
              {
                data: [
                  country2Selected.gdp || 0,
                  country2Selected.population || 0,
                  country2Selected.education || 0,
                  country2Selected.inflation || 0,
                ],
                label: `${country2Name} (${selectedYear2})`,
              },
              {
                data: [
                  country3Selected.gdp || 0,
                  country3Selected.population || 0,
                  country3Selected.education || 0,
                  country3Selected.inflation || 0,
                ],
                label: `${country3Name} (${selectedYear3})`,
              },
            ]}
            xAxis={[
              {
                data: [
                  "GDP Growth (Annual %)",
                  "Population Growth (Annual %)",
                  "Education Expenditure (% of GDP)",
                  "Inflation (Annual %)",
                ],
                scaleType: "band",
              },
            ]}
            height={400}
            margin={{ top: 50, right: 60, bottom: 60, left: 60 }}
            slotProps={{
              legend: {
                position: { vertical: "top", horizontal: "right" },
              },
            }}
          />
        </Box>

        {/* Add the labor force comparison chart */}
        {renderLabourForceComparison()}
      </Box>
    );
  };

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Economic Indicators Comparison Dashboard
      </Typography>

      {loading && country1Data.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          {/* Filters Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Country Comparison
            </Typography>
            <Grid container spacing={2} columns={12}>
              {/* Column 1 */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(120, 220, 120, 0.1)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Country 1
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Country
                    </Typography>
                    <Select
                      value={country1}
                      onChange={(e) => setCountry1(e.target.value)}
                      size="small"
                    >
                      {availableCountries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Year
                    </Typography>
                    <Select
                      value={selectedYear1}
                      onChange={(e) => setSelectedYear1(Number(e.target.value))}
                      size="small"
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Column 2 */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(120, 120, 220, 0.1)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Country 2
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Country
                    </Typography>
                    <Select
                      value={country2}
                      onChange={(e) => setCountry2(e.target.value)}
                      size="small"
                    >
                      {availableCountries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Year
                    </Typography>
                    <Select
                      value={selectedYear2}
                      onChange={(e) => setSelectedYear2(Number(e.target.value))}
                      size="small"
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Column 3 */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(220, 120, 120, 0.1)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Country 3
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Country
                    </Typography>
                    <Select
                      value={country3}
                      onChange={(e) => setCountry3(e.target.value)}
                      size="small"
                    >
                      {availableCountries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Select Year
                    </Typography>
                    <Select
                      value={selectedYear3}
                      onChange={(e) => setSelectedYear3(Number(e.target.value))}
                      size="small"
                    >
                      {availableYears.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              {/* Reset Button */}
              <Grid size={12} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  sx={{ float: "right" }}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Indicator Comparison Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Indicator Comparison
            </Typography>
            {renderIndicatorComparison()}
          </Paper>

          {/* Key Insights Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Key Insights
            </Typography>
            <Grid container spacing={2} columns={12}>
              {/* Country 1 Insights */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(120, 220, 120, 0.1)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {availableCountries.find((c) => c.code === country1)
                      ?.name || country1}{" "}
                    ({selectedYear1})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    GDP Growth:{" "}
                    {getValueForYear(country1Data, "gdp", selectedYear1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Population Growth:{" "}
                    {getValueForYear(country1Data, "population", selectedYear1)}
                    %
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Education Expenditure:{" "}
                    {getValueForYear(country1Data, "education", selectedYear1)}%
                    of GDP
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Inflation Rate:{" "}
                    {getValueForYear(country1Data, "inflation", selectedYear1)}%
                  </Typography>
                  <Typography variant="body2">
                    Labor Force:{" "}
                    {formatNumber(
                      getValueForYear(country1Data, "labour", selectedYear1)
                    )}
                  </Typography>
                </Paper>
              </Grid>

              {/* Country 2 Insights */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(120, 120, 220, 0.1)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {availableCountries.find((c) => c.code === country2)
                      ?.name || country2}{" "}
                    ({selectedYear2})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    GDP Growth:{" "}
                    {getValueForYear(country2Data, "gdp", selectedYear2)}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Population Growth:{" "}
                    {getValueForYear(country2Data, "population", selectedYear2)}
                    %
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Education Expenditure:{" "}
                    {getValueForYear(country2Data, "education", selectedYear2)}%
                    of GDP
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Inflation Rate:{" "}
                    {getValueForYear(country2Data, "inflation", selectedYear2)}%
                  </Typography>
                  <Typography variant="body2">
                    Labor Force:{" "}
                    {formatNumber(
                      getValueForYear(country2Data, "labour", selectedYear2)
                    )}
                  </Typography>
                </Paper>
              </Grid>

              {/* Country 3 Insights */}
              <Grid size={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(220, 120, 120, 0.1)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {availableCountries.find((c) => c.code === country3)
                      ?.name || country3}{" "}
                    ({selectedYear3})
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    GDP Growth:{" "}
                    {getValueForYear(country3Data, "gdp", selectedYear3)}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Population Growth:{" "}
                    {getValueForYear(country3Data, "population", selectedYear3)}
                    %
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Education Expenditure:{" "}
                    {getValueForYear(country3Data, "education", selectedYear3)}%
                    of GDP
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Inflation Rate:{" "}
                    {getValueForYear(country3Data, "inflation", selectedYear3)}%
                  </Typography>
                  <Typography variant="body2">
                    Labor Force:{" "}
                    {formatNumber(
                      getValueForYear(country3Data, "labour", selectedYear3)
                    )}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Comparative Analysis Section */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 4,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Comparative Analysis
            </Typography>
            <Grid container spacing={2} columns={12}>
              <Grid size={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body1">
                    {generateComparativeAnalysis()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Box>
  );

  // Helper function to get value for a specific year
  function getValueForYear(
    data: CountryData[],
    indicator: keyof CountryData,
    year: number
  ): string {
    const yearData = data.find((d) => d.year === year);
    if (!yearData) return "N/A";

    const value = yearData[indicator];
    if (value === null || value === undefined) return "N/A";

    return typeof value === "number" ? value.toFixed(2) : String(value);
  }

  // Helper function to format large numbers with commas
  function formatNumber(value: string | number): string {
    if (value === "N/A") return value;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num.toLocaleString();
  }

  // Generate comparative analysis text
  function generateComparativeAnalysis(): string {
    const country1Name =
      availableCountries.find((c) => c.code === country1)?.name || country1;
    const country2Name =
      availableCountries.find((c) => c.code === country2)?.name || country2;
    const country3Name =
      availableCountries.find((c) => c.code === country3)?.name || country3;

    // Get GDP values for comparison
    const gdp1 = parseFloat(
      getValueForYear(country1Data, "gdp", selectedYear1)
    );
    const gdp2 = parseFloat(
      getValueForYear(country2Data, "gdp", selectedYear2)
    );
    const gdp3 = parseFloat(
      getValueForYear(country3Data, "gdp", selectedYear3)
    );

    // Get inflation values for comparison
    const inflation1 = parseFloat(
      getValueForYear(country1Data, "inflation", selectedYear1)
    );
    const inflation2 = parseFloat(
      getValueForYear(country2Data, "inflation", selectedYear2)
    );
    const inflation3 = parseFloat(
      getValueForYear(country3Data, "inflation", selectedYear3)
    );

    // Generate analysis text
    let analysis = `Comparing the economic indicators for ${country1Name}, ${country2Name}, and ${country3Name}:\n\n`;

    // GDP comparison
    if (!isNaN(gdp1) && !isNaN(gdp2) && !isNaN(gdp3)) {
      const highestGDP = Math.max(gdp1, gdp2, gdp3);
      const lowestGDP = Math.min(gdp1, gdp2, gdp3);

      let gdpText = "In terms of GDP growth, ";
      if (highestGDP === gdp1) {
        gdpText += `${country1Name} shows the strongest growth at ${gdp1.toFixed(
          2
        )}%, `;
      } else if (highestGDP === gdp2) {
        gdpText += `${country2Name} shows the strongest growth at ${gdp2.toFixed(
          2
        )}%, `;
      } else {
        gdpText += `${country3Name} shows the strongest growth at ${gdp3.toFixed(
          2
        )}%, `;
      }

      if (lowestGDP === gdp1) {
        gdpText += `while ${country1Name} has the lowest at ${gdp1.toFixed(
          2
        )}%.`;
      } else if (lowestGDP === gdp2) {
        gdpText += `while ${country2Name} has the lowest at ${gdp2.toFixed(
          2
        )}%.`;
      } else {
        gdpText += `while ${country3Name} has the lowest at ${gdp3.toFixed(
          2
        )}%.`;
      }

      analysis += gdpText + "\n\n";
    }

    // Inflation comparison
    if (!isNaN(inflation1) && !isNaN(inflation2) && !isNaN(inflation3)) {
      const highestInflation = Math.max(inflation1, inflation2, inflation3);
      const lowestInflation = Math.min(inflation1, inflation2, inflation3);

      let inflationText = "Regarding inflation rates, ";
      if (lowestInflation === inflation1) {
        inflationText += `${country1Name} maintains the most stable prices with ${inflation1.toFixed(
          2
        )}% inflation, `;
      } else if (lowestInflation === inflation2) {
        inflationText += `${country2Name} maintains the most stable prices with ${inflation2.toFixed(
          2
        )}% inflation, `;
      } else {
        inflationText += `${country3Name} maintains the most stable prices with ${inflation3.toFixed(
          2
        )}% inflation, `;
      }

      if (highestInflation === inflation1) {
        inflationText += `while ${country1Name} faces higher inflation at ${inflation1.toFixed(
          2
        )}%.`;
      } else if (highestInflation === inflation2) {
        inflationText += `while ${country2Name} faces higher inflation at ${inflation2.toFixed(
          2
        )}%.`;
      } else {
        inflationText += `while ${country3Name} faces higher inflation at ${inflation3.toFixed(
          2
        )}%.`;
      }

      analysis += inflationText;
    }

    return analysis;
  }
}
