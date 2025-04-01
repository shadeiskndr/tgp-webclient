import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import EconomicDataService, {
  EconomicDataItem,
  Country,
} from "../services/economic-data.service";

interface UseEconomicDataProps {
  initialCountry?: string;
}

export default function useEconomicData({
  initialCountry = "MY",
}: UseEconomicDataProps = {}) {
  // Table data state
  const [tableData, setTableData] = useState<EconomicDataItem[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Chart data state (separate from table data)
  const [chartData, setChartData] = useState<EconomicDataItem[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  // Filtering states
  const [selectedCountry, setSelectedCountry] =
    useState<string>(initialCountry);
  const [startYear, setStartYear] = useState<Dayjs | null>(null);
  const [endYear, setEndYear] = useState<Dayjs | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Available countries from the data
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState<boolean>(true);

  // Fetch countries separately
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);
        const countries = await EconomicDataService.getCountries();
        setAvailableCountries(countries);
      } catch (err) {
        setError("Failed to load country list");
        console.error(err);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch chart data - only filtered by country, no pagination
  const fetchChartData = async () => {
    try {
      setChartLoading(true);

      // Filter by country and year range for chart data
      const params = {
        country: selectedCountry,
        yearFrom: startYear ? startYear.year() : undefined,
        yearTo: endYear ? endYear.year() : undefined,
        limit: 1000, // Get all data for the selected country and year range
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
        yearFrom: startYear ? startYear.year() : undefined,
        yearTo: endYear ? endYear.year() : undefined,
        limit: rowsPerPage,
        offset: resetPage ? 0 : page * rowsPerPage,
      };

      const response = await EconomicDataService.getGDP(params);

      // Update state with the response data
      setTableData(response.data);
      setTotalCount(response.total);

      if (resetPage) {
        setPage(0);
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

  // Reload table data on pagination changes
  useEffect(() => {
    fetchTableData(false);
  }, [page, rowsPerPage]);

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
    fetchChartData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCountry(initialCountry);
    setStartYear(null);
    setEndYear(null);
    // Fetch data after resetting filters
    setTimeout(() => {
      fetchTableData(true);
      fetchChartData();
    }, 0);
  };

  return {
    // Data
    tableData,
    chartData,
    availableCountries,
    totalCount,

    // Loading states
    tableLoading,
    chartLoading,
    countriesLoading,

    // Error state
    error,

    // Filter states
    selectedCountry,
    setSelectedCountry,
    startYear,
    setStartYear,
    endYear,
    setEndYear,

    // Pagination
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,

    // Actions
    fetchTableData,
    fetchChartData,
    handleApplyFilters,
    handleResetFilters,
  };
}
