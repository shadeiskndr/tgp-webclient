import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import {
  CountryData,
  getValueForYear,
  formatNumber,
} from "../../hooks/useEconomicDashboard";

interface CountryInsightsProps {
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

const CountryInsights: React.FC<CountryInsightsProps> = ({
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

  // Generate comparative analysis text
  const generateComparativeAnalysis = (): string => {
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
  };

  return (
    <>
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
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {availableCountries.find((c) => c.code === country1)?.name ||
                  country1}{" "}
                ({selectedYear1})
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                GDP Growth:{" "}
                {getValueForYear(country1Data, "gdp", selectedYear1)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Population Growth:{" "}
                {getValueForYear(country1Data, "population", selectedYear1)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Education Expenditure:{" "}
                {getValueForYear(country1Data, "education", selectedYear1)}% of
                GDP
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
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {availableCountries.find((c) => c.code === country2)?.name ||
                  country2}{" "}
                ({selectedYear2})
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                GDP Growth:{" "}
                {getValueForYear(country2Data, "gdp", selectedYear2)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Population Growth:{" "}
                {getValueForYear(country2Data, "population", selectedYear2)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Education Expenditure:{" "}
                {getValueForYear(country2Data, "education", selectedYear2)}% of
                GDP
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
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {availableCountries.find((c) => c.code === country3)?.name ||
                  country3}{" "}
                ({selectedYear3})
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                GDP Growth:{" "}
                {getValueForYear(country3Data, "gdp", selectedYear3)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Population Growth:{" "}
                {getValueForYear(country3Data, "population", selectedYear3)}%
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Education Expenditure:{" "}
                {getValueForYear(country3Data, "education", selectedYear3)}% of
                GDP
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
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {generateComparativeAnalysis()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CountryInsights;
