import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import EconomicDataService, {
  EconomicDataItem,
  Country,
  DataCategory,
} from "../services/economic-data.service";

interface UseEconomicDataProps {
  initialCountry?: string;
  dataCategory?: DataCategory;
}

export default function useEconomicData({
  initialCountry = "MY",
  dataCategory = DataCategory.GDP,
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
  const [appliedCountry, setAppliedCountry] = useState<string>(initialCountry);
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

      const params = {
        country: selectedCountry,
        yearFrom: startYear ? startYear.year() : undefined,
        yearTo: endYear ? endYear.year() : undefined,
        limit: 1000,
      };

      const response = await EconomicDataService.getEconomicData(
        dataCategory,
        params
      );

      // Sort data by year for the chart
      const sortedData = [...response.data].sort((a, b) => a.year - b.year);
      setChartData(sortedData);
    } catch (err) {
      setError(`Failed to load ${dataCategory} chart data`);
      console.error(err);
    } finally {
      setChartLoading(false);
    }
  };

  // Fetch table data with current filters and pagination
  const fetchTableData = async (resetPage = false) => {
    try {
      setTableLoading(true);

      const params = {
        country: selectedCountry,
        yearFrom: startYear ? startYear.year() : undefined,
        yearTo: endYear ? endYear.year() : undefined,
        limit: rowsPerPage,
        offset: resetPage ? 0 : page * rowsPerPage,
      };

      const response = await EconomicDataService.getEconomicData(
        dataCategory,
        params
      );

      setTableData(response.data);
      setTotalCount(response.total);

      if (resetPage) {
        setPage(0);
      }
    } catch (err) {
      setError(`Failed to load ${dataCategory} table data`);
      console.error(err);
    } finally {
      setTableLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchTableData(true);
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload table data on pagination changes
  useEffect(() => {
    fetchTableData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setAppliedCountry(selectedCountry);
    fetchTableData(true);
    fetchChartData();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCountry(initialCountry);
    setAppliedCountry(initialCountry);
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
    appliedCountry,
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
