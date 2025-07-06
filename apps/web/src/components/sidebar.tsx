//apps/web/src/components/sidebar.tsx
import { Link } from "@tanstack/react-router";
import Icon from "../components/icon";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { ProjectList } from "./project-list";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-sidebar p-4 w-full">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" aria-label="Dashboard">
          <Icon name="logo" className="h-6 w-6" />
        </Link>
        <p className="font-bold text-lg">Jira Clone</p>
      </div>
      <div className="my-4">
        <WorkspaceSwitcher/>
        <Navigation />
        <ProjectList />
      </div>
    </aside>
  );
};
