import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import EconomicDataFilters from "../components/internals/EconomicDataFilters";
import EconomicDataChart from "../components/internals/EconomicDataChart";
import EconomicDataTable from "../components/internals/EconomicDataTable";
import LoadingErrorState from "../components/internals/LoadingErrorState";
import useEconomicData from "../hooks/useEconomicData";
import { DataCategory } from "../services/economic-data.service";

export default function LaborForce() {
  const {
    tableData,
    chartData,
    availableCountries,
    totalCount,
    tableLoading,
    chartLoading,
    countriesLoading,
    error,
    selectedCountry,
    setSelectedCountry,
    appliedCountry,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleApplyFilters,
    handleResetFilters,
  } = useEconomicData({
    initialCountry: "MY",
    dataCategory: DataCategory.LABOUR,
  });

  const isLoading =
    (tableLoading && tableData.length === 0) ||
    (chartLoading && chartData.length === 0) ||
    countriesLoading;

  return (
    <Box>
      <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Labor Force Total Analysis
      </Typography>

      <LoadingErrorState loading={isLoading} error={error} isEmpty={true} />

      {!isLoading && !error && (
        <>
          <EconomicDataFilters
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            startYear={startYear}
            setStartYear={setStartYear}
            endYear={endYear}
            setEndYear={setEndYear}
            availableCountries={availableCountries}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          <Grid container spacing={0} columns={12} sx={{ mb: 4 }}>
            <Grid size={12}>
              <EconomicDataChart
                chartData={chartData}
                chartLoading={chartLoading}
                selectedCountry={appliedCountry}
                availableCountries={availableCountries}
                title="Labor Force Total Trends"
                yAxisLabel="Labor Force Total"
              />
            </Grid>
          </Grid>

          <Grid container spacing={0} columns={12}>
            <Grid size={12}>
              <EconomicDataTable
                tableData={tableData}
                tableLoading={tableLoading}
                totalCount={totalCount}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                title="Labor Force Total Details"
                valueLabel="Labor Force Total"
                isPercentage={false}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
