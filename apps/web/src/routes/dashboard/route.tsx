// apps/web/src/routes/dashboard/route.tsx
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouteContext,
} from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Sidebar } from "@/components/sidebar";
import { MoonLoader } from "react-spinners";


export const Route = createFileRoute("/dashboard")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    return { session };
  },
  component: DashboardLayout,
  pendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <MoonLoader color="#000aff" loading size={40} />
    </div>
  ),
});

function DashboardLayout() {
  const { session } = useRouteContext({ from: "/dashboard" });

  return (
    <div className="min-h-screen">
      <h1 className="sr-only">Dashboard for {session.user.name}</h1>
      <div className="flex h-full w-full">
        <aside className="fixed left-0 top-0 hidden h-full overflow-y-auto lg:block lg:w-[264px]">
          <Sidebar />
        </aside>
        <div className="w-full lg:pl-[264px]">
          <div className="mx-auto h-full max-w-screen-2xl">
            <main className="flex h-full flex-col px-6 py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
