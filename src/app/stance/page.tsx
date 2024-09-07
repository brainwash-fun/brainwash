"use client";

import StanceTitle from "@/components/StanceTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { stanceTheme } from "@/styles/theme";
import PoliticianSearch from "@/components/PoliticianSearch";

const muiStanceTheme = createTheme(stanceTheme);

export default function StancePage() {
  return (
    <ThemeProvider theme={muiStanceTheme}>
      <main
        className="min-h-screen"
        style={{ backgroundColor: stanceTheme.palette.background.default }}
      >
        <div className="container mx-auto px-4 w-[90%] flex flex-col items-center pt-20">
          <StanceTitle />
          <div className="w-full max-w-md mt-6">
            <PoliticianSearch />
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
