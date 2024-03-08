import "@mui/material/styles";
import "@mui/material/Button";

declare module "@mui/material/styles" {
  interface ButtonVariants {
    gradient: React.CSSProperties;
    outlinedPaper: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface ButtonVariantsOptions {
    gradient?: React.CSSProperties;
    outlinedPaper?: React.CSSProperties;
  }
}

// Update the Button's variant prop options
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    gradient: true;
    outlinedPaper: true;
  }
}
