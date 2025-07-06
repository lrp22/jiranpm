// apps/web/src/components/header.tsx

import { Link, useRouterState } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import Icon from "./icon";
import { MobileSidebar } from "./mobile-sidebar";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDashboardLayout = pathname.startsWith("/dashboard");

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/#about", label: "About" },
    { to: "/#price", label: "Price" },
  ];
  const privateLinks = [];
  if (isPending) {
    return (
      <header className="flex h-14 items-center justify-end border-b px-4">
        <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
      </header>
    );
  }

  const logoHref = session ? "/dashboard" : "/";

  return (
    <header
      className={cn(
        "flex h-14 items-center border-b px-4 transition-all duration-300",
        isDashboardLayout && "lg:pl-[264px]"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          {isDashboardLayout && <MobileSidebar />}
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            {isDashboardLayout ? (
              // --- DASHBOARD VIEW (Desktop) ---
              <div className="flex items-center gap-2 text-muted-foreground">
                {privateLinks.map((link, index) => (
                  <div key={link.to} className="flex items-center gap-2">
                    <Link
                      to={link.to}
                      className="transition-colors hover:text-foreground"
                      activeProps={{
                        className: "text-foreground font-semibold",
                      }}
                    >
                      {link.label}
                    </Link>
                    {index < privateLinks.length - 1 && <span>/</span>}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Link
                  to={logoHref}
                  aria-label="Home"
                  className="flex items-center gap-2"
                >
                  <Icon name="logo" className="h-6 w-6" />
                  <span className="font-bold">Jira Clone</span>
                </Link>
                {publicLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    activeProps={{ className: "text-foreground" }}
                  >
                    {label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Right side of header remains the same */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
