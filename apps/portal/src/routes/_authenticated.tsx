import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchAuthSession } from "aws-amplify/auth";
import AppBar from "src/components/AppBar";
import { CenterStack, FullScreen } from "src/components/Layout";
import Page from "src/components/Page";
import Loader from "src/shared/Loader";
import { queryClient } from "src/shared/trpc";
import { useAuth } from "../shared/auth";

const Component = () => {
  const availableUsers = useQuery({
    queryKey: ["availableUsers"],
    queryFn: async () => {
      const { tokens, userSub } = (await fetchAuthSession()) ?? {};
      return [{ workspaceId: userSub, role: "admin", id: userSub }];
    },
  });

  if (availableUsers.isLoading) {
    return (
      <FullScreen>
        <CenterStack>
          <Loader />
        </CenterStack>
      </FullScreen>
    );
  }

  return (
    <>
      <AppBar />
      <Page>
        <Outlet />
      </Page>
    </>
  );
};

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    try {
      const { tokens, userSub } = (await fetchAuthSession()) ?? {};
      let accessToken;
      if (tokens) accessToken = tokens.accessToken;
      if (accessToken && userSub) {
        const data = await queryClient.ensureQueryData({
          queryKey: ["availableUsers"],
          queryFn: () => {
            return [{ workspaceId: userSub, role: "admin", id: userSub }];
          },
          staleTime: 900,
        });
        const gotUser = data.find((item) => item.workspaceId === useAuth.getState().workspaceId);
        const firstAvailable = data.at(0);
        if (!gotUser && firstAvailable) {
          useAuth
            .getState()
            .setWorkspace({ id: firstAvailable.workspaceId, role: firstAvailable.role });
        }
        return;
      }
    } catch (err) {
      throw redirect({ to: "/auth" });
    }
    throw redirect({ to: "/auth" });
  },
  component: Component,
});
