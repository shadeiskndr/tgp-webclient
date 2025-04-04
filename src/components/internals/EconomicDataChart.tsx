import { CircularProgress, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  EconomicDataItem,
  Country,
} from "../../services/economic-data.service";

interface EconomicDataChartProps {
  chartData: EconomicDataItem[];
  chartLoading: boolean;
  selectedCountry: string;
  availableCountries: Country[];
  title: string;
  yAxisLabel?: string;
}

export default function EconomicDataChart({
  chartData,
  chartLoading,
  selectedCountry,
  availableCountries,
  title,
  yAxisLabel = "Value",
}: EconomicDataChartProps) {
  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: 500,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {chartLoading ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Grid>
              <CircularProgress />
            </Grid>
          </Grid>
        ) : chartData.length > 0 ? (
          <LineChart
            series={[
              {
                data: chartData.map((item) => item.value),
                label: `${yAxisLabel} - ${
                  availableCountries.find((c) => c.code === selectedCountry)
                    ?.name || "All Countries"
                }`,
                color: "hsl(120, 70%, 50%)",
                curve: "catmullRom",
                showMark: false,
                area: true,
              },
            ]}
            xAxis={[
              {
                data: chartData.map((item) => item.year),
                scaleType: "point",
                label: "Year",
                valueFormatter: (value) => value.toString(),
              },
            ]}
            height={450}
            margin={{ top: 60, right: 30, bottom: 45, left: 70 }}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "top", horizontal: "right" },
                padding: -1,
              },
            }}
          />
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Grid>
              <Typography color="text.secondary">
                No data available for the selected country
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </>
  );
}
