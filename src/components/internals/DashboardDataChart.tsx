import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { BarChart } from "@mui/x-charts/BarChart";
import { LinearProgress, Stack } from "@mui/material";
import { CountryData } from "../../hooks/useEconomicDashboard";

interface DashboardDataChartProps {
  country1: string;
  country2: string;
  country3: string;
  selectedYear1: number;
  selectedYear2: number;
  selectedYear3: number;
  country1Data: CountryData[];
  country2Data: CountryData[];
  country3Data: CountryData[];
  availableCountries: { code: string; name: string }[];
}

const DashboardDataChart: React.FC<DashboardDataChartProps> = ({
  country1,
  country2,
  country3,
  selectedYear1,
  selectedYear2,
  selectedYear3,
  country1Data,
  country2Data,
  country3Data,
  availableCountries,
}) => {
  // Find country names
  const country1Name =
    availableCountries.find((c) => c.code === country1)?.name || country1;
  const country2Name =
    availableCountries.find((c) => c.code === country2)?.name || country2;
  const country3Name =
    availableCountries.find((c) => c.code === country3)?.name || country3;

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

        {/* Labor Force Comparison */}
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
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
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
      </Box>
    </Paper>
  );
};

export default DashboardDataChart;
