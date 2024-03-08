import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    gray: Palette["primary"];
    darkGray: { main: string };
  }

  interface PaletteOptions {
    gray?: PaletteOptions["primary"];
    darkGray: { main: string };
  }
}

export const bondiBlue = {
  "50": "#ebfffc",
  "100": "#cdfffc",
  "200": "#a1fffc",
  "300": "#60fffd",
  "400": "#18f7f8",
  "500": "#00d9de",
  "600": "#00a9b5",
  "700": "#088996",
  "800": "#106e7a",
  "900": "#125b67",
  "950": "#053c47",
};
export const gray = {
  "50": "#f9fafb",
  "100": "#f3f4f6",
  "200": "#e5e7eb",
  "300": "#d1d5db",
  "400": "#9ca3af",
  "500": "#6b7280",
  "600": "#4b5563",
  "700": "#374151",
  "800": "#1f2937",
  "900": "#111827",
  "950": "#030712",
};

const constants = {
  typography: {
    fontFamily: "Rubik, sans-serif",
  },
};

export const darkTheme = createTheme({
  ...constants,
  palette: {
    mode: "dark",
    primary: {
      light: bondiBlue["200"],
      main: bondiBlue["600"],
      dark: bondiBlue["700"],
      contrastText: "#ffffff",
    },
    gray: {
      main: gray["400"],
    },
    darkGray: {
      main: gray["800"],
    },
    background: {
      default: gray["800"], // "#191c1d",
      paper: "#2a3441",
    },
    // success: {
    //   main: "#88d982",
    // },
    // warning: {
    //   main: "#e2c62c",
    // },
    // error: {
    //   main: "#ffb4ab",
    // },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: bondiBlue["300"],
          color: bondiBlue["300"],
          textTransform: "none",
          fontSize: "1rem",
        },
        containedPrimary: {
          background: bondiBlue["500"],
          color: bondiBlue["950"],
          ":hover": {
            background: bondiBlue["300"],
          },
          ":active": {
            background: bondiBlue["600"],
          },
          ":disabled": {
            background: bondiBlue["800"],
            color: bondiBlue["100"],
          },
        },
        outlinedPrimary: {
          color: bondiBlue["300"],
          borderColor: bondiBlue["300"],
        },
      },
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            background: `linear-gradient(135deg, ${bondiBlue[300]} 0%, ${bondiBlue[500]} 100%)`,
            color: bondiBlue["950"],
          },
        },
      ],
    },
  },
});
