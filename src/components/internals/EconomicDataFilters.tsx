import { Dayjs } from "dayjs";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Paper from "@mui/material/Paper";
import { Country } from "../../services/economic-data.service";

interface EconomicDataFiltersProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  startYear: Dayjs | null;
  setStartYear: (year: Dayjs | null) => void;
  endYear: Dayjs | null;
  setEndYear: (year: Dayjs | null) => void;
  availableCountries: Country[];
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export default function EconomicDataFilters({
  selectedCountry,
  setSelectedCountry,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  availableCountries,
  onApplyFilters,
  onResetFilters,
}: EconomicDataFiltersProps) {
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
        Filters
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={3}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Country
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {availableCountries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={3}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            From Year
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={startYear}
              onChange={(newValue) => setStartYear(newValue)}
              views={["year"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={3}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            To Year
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={endYear}
              onChange={(newValue) => setEndYear(newValue)}
              views={["year"]}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid size={3} sx={{ display: "flex", alignItems: "center", mt: 3.5 }}>
          <Button
            variant="outlined"
            onClick={onApplyFilters}
            sx={{ mr: 1 }}
            fullWidth
          >
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={onResetFilters} fullWidth>
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
