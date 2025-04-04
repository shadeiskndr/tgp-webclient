import {
  Box,
  CircularProgress,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";
import { EconomicDataItem } from "../../services/economic-data.service";

interface EconomicDataTableProps {
  tableData: EconomicDataItem[];
  tableLoading: boolean;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  title: string;
  valueLabel?: string;
  isPercentage?: boolean;
}

export default function EconomicDataTable({
  tableData,
  tableLoading,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  title,
  valueLabel = "Value",
  isPercentage = true,
}: EconomicDataTableProps) {
  const sortedTableData = [...tableData].sort((a, b) => b.year - a.year);

  // Define formatting options based on isPercentage
  const numberFormatOptions: Intl.NumberFormatOptions = isPercentage
    ? { maximumFractionDigits: 2, minimumFractionDigits: 2 } // Force 2 decimals for percentages
    : { maximumFractionDigits: 0 }; // Allow 0 decimals for non-percentages (like totals)

  return (
    <>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
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
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
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
                  {valueLabel}
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
                    {item.value.toLocaleString(undefined, numberFormatOptions)}
                    {isPercentage && "%"}
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
    </>
  );
}
