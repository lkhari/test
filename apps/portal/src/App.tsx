import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorComponent, RouterProvider, createRouter } from "@tanstack/react-router";
import { Amplify } from "aws-amplify";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import duration from "dayjs/plugin/duration";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo } from "react";
import { Toaster } from "react-hot-toast";
import i18n from "./i18n";
import { routeTree } from "./routeTree.gen";
import { darkTheme } from "./shared/theme";
import { queryClient } from "./shared/trpc";

dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <> Loading</>
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {},
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

i18n.on("languageChanged", function (locale) {
  try {
    import(`../node_modules/dayjs/esm/locale/${locale}.js`)
      .then((localeData) => {
        console.log(localeData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        dayjs.locale(locale, localeData.default, true);
      })
      .catch(() => {
        console.log("failed");
      });
  } catch (err) {
    console.log(".");
  }
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_4qE2fGSMJ",
      userPoolClientId: "419uvd952jnqi09ocrq97bl5rt",
    },
  },
});

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(() => (prefersDarkMode ? darkTheme : darkTheme), [prefersDarkMode]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={navigator.language.split(";").at(0)?.toLowerCase() || "en-gb"}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}
