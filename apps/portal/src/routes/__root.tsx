import { Outlet, rootRouteWithContext } from "@tanstack/react-router";

export const Route = rootRouteWithContext()({
  component: () => <Outlet />,
});
