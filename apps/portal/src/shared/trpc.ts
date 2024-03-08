import { QueryClient } from "@tanstack/react-query";
import { HTTPHeaders } from "@trpc/client";
import { createTRPCQueryUtils, createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { fetchAuthSession } from "aws-amplify/auth";

import { useAuth } from "./auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 20,
    },
  },
});
