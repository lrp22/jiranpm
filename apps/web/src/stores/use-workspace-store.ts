import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of our store's state and actions
type WorkspaceStore = {
  lastWorkspaceId: string | null;
  setLastWorkspaceId: (workspaceId: string) => void;
};

// Create the store using the `persist` middleware
export const useWorkspaceStore = create(
  persist<WorkspaceStore>(
    (set) => ({
      // Initial state
      lastWorkspaceId: null,
      // Action to update the state
      setLastWorkspaceId: (workspaceId) =>
        set({ lastWorkspaceId: workspaceId }),
    }),
    {
      // This is the key that will be used in localStorage
      name: "workspace-storage",
    }
  )
);
