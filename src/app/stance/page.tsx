"use client";

import StanceTitle from "@/components/StanceTitle";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // You can customize this color
    },
    secondary: {
      main: "#00FF00",
    },
  },
});

const defaultOptions = [
  "Kamala Harris",
  "Donald Trump",
  "Joe Biden",
  "Barack Obama",
];

export default function StancePage() {
  return (
    <ThemeProvider theme={theme}>
      <main className="container mx-auto px-4 w-[90%] flex flex-col items-center min-h-screen pt-20">
        <StanceTitle />
        <div className="w-full max-w-md mt-6 flex gap-1">
          <Autocomplete
            freeSolo
            options={defaultOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                placeholder="Search for a politician..."
              />
            )}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            sx={{
              backgroundColor: "green",
              color: "white",
              borderRadius: "4px",
              padding: "14px",
              "&:hover": {
                backgroundColor: "darkgreen",
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </main>
    </ThemeProvider>
  );
}
