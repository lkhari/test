import { Box, Stack, styled } from "@mui/material";

export const FullScreen = styled(Box)({
  inset: 0,
  display: "flex",
  position: "fixed",
  alignItems: "center",
  justifyContent: "center",
});
export const CenterStack = styled(Stack)({
  flexDirection: "column",
  alignItems: "center",
});
