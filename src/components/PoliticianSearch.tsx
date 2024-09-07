import { Autocomplete, TextField, Paper, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { stanceTheme } from "@/styles/theme";
import { useRouter } from "next/navigation";

type Party = "D" | "R" | "I";

interface Politician {
  name: string;
  state: string;
  party: Party;
}

const defaultOptions: Politician[] = [
  { name: "Kamala Harris", state: "CA", party: "D" },
  { name: "Donald Trump", state: "FL", party: "R" },
  { name: "Joe Biden", state: "DE", party: "D" },
  { name: "Bernie Sanders", state: "VT", party: "I" },
];

const StyledOption = styled("li")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.background.hover,
  },
}));

export default function PoliticianSearch() {
  const router = useRouter();

  const handleSearch = (politician: Politician | string) => {
    if (typeof politician === "object" && politician.name) {
      const formattedName = politician.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/stance/politician/${formattedName}`);
    }
  };

  return (
    <div className="flex gap-1">
      <Autocomplete
        freeSolo
        options={defaultOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderOption={(props, option) => (
          <StyledOption {...props}>
            <div className="flex justify-between w-full items-center">
              <span>{option.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">{option.state}</span>
                <div
                  className="text-white rounded w-5 h-5 flex justify-center items-center font-bold text-xs"
                  style={{
                    backgroundColor: stanceTheme.palette.party[option.party],
                    lineHeight: 1, // Add this line
                  }}
                >
                  {option.party}
                </div>
              </div>
            </div>
          </StyledOption>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            placeholder="Search for a politician..."
          />
        )}
        PaperComponent={({ children }) => (
          <Paper
            style={{
              backgroundColor: stanceTheme.palette.background.default,
              margin: 0,
            }}
          >
            {children}
          </Paper>
        )}
        sx={{
          flexGrow: 1,
          "& .MuiAutocomplete-paper": {
            backgroundColor: stanceTheme.palette.background.default,
          },
          "& .MuiAutocomplete-listbox": {
            padding: 0,
          },
          "& .MuiAutocomplete-option:hover": {
            backgroundColor: stanceTheme.palette.background.hover,
          },
        }}
        onChange={(event, value) => value && handleSearch(value)}
      />
      <IconButton
        onClick={() => {
          const inputValue = document.querySelector(
            'input[type="text"]'
          ) as HTMLInputElement;
          handleSearch(inputValue.value);
        }}
        sx={{
          backgroundColor: stanceTheme.palette.primary.main,
          color: "white",
          borderRadius: "4px",
          padding: "14px",
          "&:hover": {
            backgroundColor: stanceTheme.palette.primary.dark,
          },
          "&.MuiIconButton-root": {
            backgroundColor: stanceTheme.palette.primary.main,
            "&:hover": {
              backgroundColor: stanceTheme.palette.primary.dark,
            },
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </div>
  );
}
