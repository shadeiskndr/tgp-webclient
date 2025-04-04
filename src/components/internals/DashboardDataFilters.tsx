import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

interface DashboardDataFiltersProps {
  country1: string;
  country2: string;
  country3: string;
  selectedYear1: number;
  selectedYear2: number;
  selectedYear3: number;
  availableCountries: { code: string; name: string }[];
  availableYears: number[];
  onCountry1Change: (value: string) => void;
  onCountry2Change: (value: string) => void;
  onCountry3Change: (value: string) => void;
  onYear1Change: (value: number) => void;
  onYear2Change: (value: number) => void;
  onYear3Change: (value: number) => void;
  onResetFilters: () => void;
}

const DashboardDataFilters: React.FC<DashboardDataFiltersProps> = ({
  country1,
  country2,
  country3,
  selectedYear1,
  selectedYear2,
  selectedYear3,
  availableCountries,
  availableYears,
  onCountry1Change,
  onCountry2Change,
  onCountry3Change,
  onYear1Change,
  onYear2Change,
  onYear3Change,
  onResetFilters,
}) => {
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
                onChange={(e) => onCountry1Change(e.target.value)}
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
                onChange={(e) => onYear1Change(Number(e.target.value))}
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
                onChange={(e) => onCountry2Change(e.target.value)}
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
                onChange={(e) => onYear2Change(Number(e.target.value))}
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
                onChange={(e) => onCountry3Change(e.target.value)}
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
                onChange={(e) => onYear3Change(Number(e.target.value))}
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
            onClick={onResetFilters}
            sx={{ float: "right" }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DashboardDataFilters;
