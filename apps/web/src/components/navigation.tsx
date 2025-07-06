import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { useWorkspaceStore } from "@/stores/use-workspace-store";

export const Navigation = () => {
  // 1. Get the current workspace ID from the URL params
  const { matches } = useRouterState();
  const lastMatch = matches[matches.length - 1];
  const params = lastMatch?.params ?? {};
  const currentWorkspaceId =
    "workspaceId" in params ? String(params.workspaceId) : null;
  const lastWorkspaceId = useWorkspaceStore((state) => state.lastWorkspaceId);

  const homeHref = currentWorkspaceId
    ? `/dashboard/workspaces/${currentWorkspaceId}`
    : lastWorkspaceId
      ? `/dashboard/workspaces/${lastWorkspaceId}`
      : "/dashboard";
  // 3. Define the routes dynamically inside the component
  const routes = [
    {
      label: "Home",
      // The "Home" link points to the last selected workspace, or to the selection page if none exists
      href: homeHref,
      icon: GoHome,
      activeIcon: GoHomeFill,
      // The home link is active if we are on ANY workspace's root dashboard
      isActive: (pathname: string) =>
        /^\/dashboard\/workspaces\/\d+$/.test(pathname),
    },
    {
      label: "My Tasks",
      href: currentWorkspaceId
        ? `/dashboard/workspaces/${currentWorkspaceId}/tasks`
        : "#",
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
      disabled: !currentWorkspaceId,
    },
    {
      label: "Settings",
      href: currentWorkspaceId
        ? `/dashboard/workspaces/${currentWorkspaceId}/settings`
        : "#",
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
      disabled: !currentWorkspaceId,
    },
    {
      label: "Members",
      href: currentWorkspaceId
        ? `/dashboard/workspaces/${currentWorkspaceId}/members`
        : "#",
      icon: UsersIcon,
      activeIcon: UsersIcon,
      disabled: !currentWorkspaceId,
    },
  ];

  return (
    <ul className="mt-2 flex flex-col gap-y-1">
      {routes.map((item) => (
        <li key={item.label}>
          {/* 4. Use Link's render prop for powerful active state handling */}
          <Link
            to={item.href}
            disabled={item.disabled}
            // Use activeOptions for routes that don't have custom logic
            activeOptions={item.isActive ? undefined : { exact: true }}
          >
            {({ isActive: isLinkActive }) => {
              // Use our custom isActive function for "Home", otherwise use the link's state
              const isActive = item.isActive
                ? item.isActive(location.pathname)
                : isLinkActive;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <div
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 rounded-md font-medium transition",
                    isActive
                      ? "text-primary" // Active state
                      : "text-neutral-500 hover:text-primary", // Inactive state
                    item.disabled &&
                      "cursor-not-allowed opacity-50 hover:text-neutral-500" // Disabled state
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5",
                      isActive ? "text-primary" : "text-neutral-500"
                    )}
                  />
                  {item.label}
                </div>
              );
            }}
          </Link>
        </li>
      ))}
    </ul>
  );
};
