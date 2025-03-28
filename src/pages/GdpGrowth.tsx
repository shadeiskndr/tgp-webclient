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
  EconomicDataItem,
} from "../services/economic-data.service";

export default function GdpGrowth() {
  // Table data state
  const [tableData, setTableData] = useState<EconomicDataItem[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Chart data state (separate from table data)
  const [chartData, setChartData] = useState<EconomicDataItem[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(true);

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

  // Fetch chart data - only filtered by country, no pagination
  const fetchChartData = async () => {
    try {
      setChartLoading(true);

      // Only filter by country for the chart data
      const params = {
        country: selectedCountry,
      };

      const response = await EconomicDataService.getGDP(params);

      // Sort data by year for the chart
      const sortedData = [...response.data].sort((a, b) => a.year - b.year);
      setChartData(sortedData);
    } catch (err) {
      setError("Failed to load GDP growth chart data");
      console.error(err);
    } finally {
      setChartLoading(false);
    }
  };

  // Fetch table data with current filters and pagination
  const fetchTableData = async (resetPage = false) => {
    try {
      setTableLoading(true);

      // Build filter parameters for table data
      const params: any = {
        country: selectedCountry,
        limit: rowsPerPage,
        offset: resetPage ? 0 : page * rowsPerPage,
      };

      // Only add year filter if a specific year is selected
      if (startYear && endYear) {
        // For date range, we'll filter client-side since the API only supports single year
        params.year = null;
      } else if (startYear) {
        params.year = startYear.year();
      } else if (endYear) {
        params.year = endYear.year();
      }

      const response = await EconomicDataService.getGDP(params);

      // Update state with the response data
      setTableData(response.data);
      setTotalCount(response.total);

      if (resetPage) {
        setPage(0);
      }

      // Extract unique countries if this is the first load
      if (availableCountries.length === 0) {
        // Fetch all countries (separate request with higher limit)
        const allCountriesResponse = await EconomicDataService.getGDP({
          limit: 1000,
        });
        const countries = allCountriesResponse.data.reduce(
          (acc: { code: string; name: string }[], item) => {
            if (!acc.some((c) => c.code === item.iso_code)) {
              acc.push({ code: item.iso_code, name: item.country_name });
            }
            return acc;
          },
          []
        );
        setAvailableCountries(countries);
      }
    } catch (err) {
      setError("Failed to load GDP growth table data");
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTableData(true);
    fetchChartData();
  }, []);

  // Reload chart data when country changes
  useEffect(() => {
    fetchChartData();
  }, [selectedCountry]);

  // Reload table data when country changes
  useEffect(() => {
    fetchTableData(true);
  }, [selectedCountry]);

  // Reload table data on pagination changes
  useEffect(() => {
    fetchTableData(false);
  }, [page, rowsPerPage]);

  // Filter table data based on selected date range (client-side filtering for date ranges)
  const filteredTableData = useMemo(() => {
    return tableData.filter((item) => {
      // Filter by date range (if both are specified)
      const yearMatch =
        (!startYear || item.year >= startYear.year()) &&
        (!endYear || item.year <= endYear.year());

      return yearMatch;
    });
  }, [tableData, startYear, endYear]);

  // Sort table data by year for proper display
  const sortedTableData = useMemo(() => {
    return [...filteredTableData].sort((a, b) => b.year - a.year);
  }, [filteredTableData]);

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

  // Apply date filters
  const handleApplyFilters = () => {
    fetchTableData(true);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCountry("MY");
    setStartYear(null);
    setEndYear(null);
    fetchTableData(true);
    fetchChartData();
  };

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        GDP Growth (Annual %) Analysis
      </Typography>

      {(tableLoading && tableData.length === 0) ||
      (chartLoading && chartData.length === 0) ? (
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
                  onClick={handleApplyFilters}
                  sx={{ mr: 1 }}
                  fullWidth
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  fullWidth
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            GDP Growth Trends
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
                {chartLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : chartData.length > 0 ? (
                  <LineChart
                    series={[
                      {
                        data: chartData.map((item) => item.value),
                        label: `GDP Growth Rate (Annual %) - ${
                          availableCountries.find(
                            (c) => c.code === selectedCountry
                          )?.name || "All Countries"
                        }`,
                        color: "hsl(120, 70%, 50%)",
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
                      No GDP growth data available for the selected country
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            GDP Growth Details
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
                {tableLoading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 2 }}
                  >
                    <CircularProgress size={30} />
                  </Box>
                )}

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
                          GDP Growth Rate (Annual %)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTableData.map((item) => (
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
                            {item.value.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
                <TablePagination
                  component="div"
                  count={totalCount}
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
