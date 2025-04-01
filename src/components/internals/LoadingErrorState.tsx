import { Box, CircularProgress, Alert } from "@mui/material";

interface LoadingErrorStateProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
}

export default function LoadingErrorState({
  loading,
  error,
  isEmpty = false,
}: LoadingErrorStateProps) {
  if (loading && isEmpty) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  return null;
}
