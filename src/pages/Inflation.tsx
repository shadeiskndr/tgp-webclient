import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { LineChart } from "@mui/x-charts/LineChart";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import { Dayjs } from "dayjs";
import EconomicDataService, {
  InflationData,
} from "../services/economic-data.service";

export default function Inflation() {
  const [data, setData] = useState<InflationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering states
  const [selectedCountry, setSelectedCountry] = useState<string>("MY");
  const [startYear, setStartYear] = useState<Dayjs | null>(null);
  const [endYear, setEndYear] = useState<Dayjs | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Available countries from the data
  const [availableCountries, setAvailableCountries] = useState<
    { code: string; name: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await EconomicDataService.getInflation();
        setData(response.inflation || []);

        // Extract unique countries from the data
        const countries = response.inflation.reduce(
          (acc: { code: string; name: string }[], item) => {
            if (!acc.some((c) => c.code === item.iso_code)) {
              acc.push({ code: item.iso_code, name: item.country_name });
            }
            return acc;
          },
          []
        );
        setAvailableCountries(countries);
      } catch (err) {
        setError("Failed to load inflation data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected country and date range
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter by country
      const countryMatch = selectedCountry
        ? item.iso_code === selectedCountry
        : true;

      // Filter by date range
      const yearMatch =
        (!startYear || item.year >= startYear.year()) &&
        (!endYear || item.year <= endYear.year());

      return countryMatch && yearMatch;
    });
  }, [data, selectedCountry, startYear, endYear]);

  // Sort data by year for proper display
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => a.year - b.year);
  }, [filteredData]);

  // Paginated data for the table
  const paginatedData = useMemo(() => {
    return sortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage]);

  // Handle pagination changes
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCountry("MY");
    setStartYear(null);
    setEndYear(null);
    setPage(0);
  };

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Inflation (Annual %) Analysis
      </Typography>

      {loading ? (
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
              <Grid
                size={3}
                sx={{ display: "flex", alignItems: "center", mt: 3.5 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  fullWidth
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Inflation Trends
          </Typography>
          <Grid container spacing={2} columns={12} sx={{ mb: 4 }}>
            <Grid size={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: 500,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {sortedData.length > 0 ? (
                  <LineChart
                    series={[
                      {
                        data: sortedData.map((item) => item.inflation_rate),
                        label: `Inflation (Annual %) - ${
                          availableCountries.find(
                            (c) => c.code === selectedCountry
                          )?.name || "All Countries"
                        }`,
                        color: "hsl(0, 100%, 55%)",
                      },
                    ]}
                    xAxis={[
                      {
                        data: sortedData.map((item) => item.year),
                        scaleType: "point",
                        label: "Year",
                        valueFormatter: (value) => value.toString(),
                      },
                    ]}
                    height={460}
                    margin={{ top: 50, right: 40, bottom: 40, left: 40 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      No inflation data available for the selected filters
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Inflation Details
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
                <Box sx={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Year
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Country
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "12px 16px",
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                          }}
                        >
                          Inflation Rate (Annual %)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((item) => (
                        <tr key={item.id}>
                          <td
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.year}
                          </td>
                          <td
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.country_name}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "12px 16px",
                              borderBottom: "1px solid rgba(224, 224, 224, 1)",
                            }}
                          >
                            {item.inflation_rate.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
                <TablePagination
                  component="div"
                  count={sortedData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
