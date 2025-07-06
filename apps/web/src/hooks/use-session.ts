import { useRouterState } from "@tanstack/react-router";
import { Route as DashboardRoute } from "../routes/dashboard/route";

// Define the shape of the user and session data based on your logs
type User = {
  id: string;
  name: string | null;
  email: string;
  // ... other user properties
};

type Session = {
  id: string;
  userId: string;
  // ... other session properties
};

// This is the actual shape of our context
type SessionContext = {
  session: Session;
  user: User;
} | null;

/**
 * A robust, type-safe hook to get the session and user data from the 
 * nearest '/dashboard' route context.
 */
export const useSession = (): SessionContext => {
  const { matches } = useRouterState();
  const dashboardMatch = matches.find((match) => match.id === DashboardRoute.id);
  
  // The context from `beforeLoad` is the entire { session, user } object
  const context = dashboardMatch?.context as { session: SessionContext } | undefined;

  return context?.session ?? null;
};