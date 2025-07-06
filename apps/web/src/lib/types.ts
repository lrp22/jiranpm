import type { AppRouter } from "../../../server/src/routers";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type Workspace = RouterOutput["workspace"]["getById"];
