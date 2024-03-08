import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import {
  alpha,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  styled,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { signOut } from "aws-amplify/auth";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/shared/auth";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    keepMounted
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function ResponsiveAppBar() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const router = useRouter();
  const auth = useAuth();
  const settings = [
    { key: "Help", onClick: () => {} },
    {
      key: "Logout",
      onClick: async () => {
        try {
          await Promise.all([signOut()]);
          auth.logout();
          router.navigate({ to: "/auth", replace: true });
          router.invalidate();
        } catch (err) {
          console.log(err);
        }
      },
    },
  ] as const;

  const [isDrawerOpen, setDrawerState] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = () => {
    setDrawerState(true);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setDrawerState(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar enableColorOnDark color={"darkGray"} elevation={0}>
        <Container>
          <Toolbar disableGutters>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontWeight: 700,
                  }}
                >
                  Page
                </Typography>
              </Link>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-app-bar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: { sm: ".25rem", xs: "0rem" },
                    color: "primary.contrastText",
                  }}
                >
                  Page
                </Typography>
              </Link>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }} variant={"rounded"}>
                    {/* {user.name.split(" ").map((item) => item.charAt(0).toUpperCase())} */}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <StyledMenu
                sx={{ mt: "45px" }}
                id="menu-app-bar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.key}
                    onClick={() => {
                      setting.onClick();
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      {t(`AppBar.${setting.key}` as const)}
                    </Typography>
                  </MenuItem>
                ))}
              </StyledMenu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer variant="persistent" anchor="left" open={isDrawerOpen}>
        <IconButton onClick={handleCloseNavMenu}>
          <ChevronLeftOutlinedIcon />
        </IconButton>

        <Divider />
        <List></List>
      </Drawer>
    </>
  );
}
export default ResponsiveAppBar;
