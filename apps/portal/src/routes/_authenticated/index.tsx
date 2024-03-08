import { createFileRoute } from "@tanstack/react-router";

const OfficialDashboard = () => {
  return <>hi</>;
};

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad() {},
  component: OfficialDashboard,
});
