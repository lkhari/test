import SportsIcon from "@mui/icons-material/Sports";
import { Box, Typography, styled } from "@mui/material";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "aws-amplify/auth";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FullScreen, CenterStack } from "src/components/Layout";

const Logo = styled(SportsIcon)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : theme.palette.primary.main,
}));

export const Auth: FC = () => {
  const { t } = useTranslation("auth");

  return (
    <FullScreen>
      <Box sx={{ width: 300 }}>
        <CenterStack gap={0} sx={{}}>
          <CenterStack sx={{ flexDirection: "column", alignItems: "center" }}>
            <Logo sx={{ fontSize: 60 }} />
            <Typography variant="h6"> {t("Welcome")}</Typography>
          </CenterStack>
          <Outlet />
        </CenterStack>
      </Box>
    </FullScreen>
  );
};

export const Route = createFileRoute("/_unauthorized")({
  beforeLoad: async () => {
    const { username } = await getCurrentUser().catch((err) => {
      return { username: undefined };
    });
    if (username) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: Auth,
});
