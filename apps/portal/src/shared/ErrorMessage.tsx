import { Typography } from "@mui/material";
import { FC } from "react";

export const ErrorMessage: FC<{ error?: string }> = ({ error }) => {
  return <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>;
};
