import { create } from "zustand";

type CreateWorkspaceModalStore = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

// This hook can be called from any component to control the modal
export const useCreateWorkspaceModal = create<CreateWorkspaceModalStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  })
);
