import { Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { useFormContext } from "react-hook-form";

export const ErrorMessage: FC<{ error?: string }> = ({ error }) => {
  const { formState } = useFormContext();
  return (
    <Typography aria-errormessage={formState.errors.root?.message} variant="body2" color="error">
      {formState.errors.root?.message}
    </Typography>
  );
};
