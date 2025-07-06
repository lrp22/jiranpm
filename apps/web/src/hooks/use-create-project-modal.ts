import { create } from "zustand";

type CreateProjectModalStore = {
  isOpen: boolean;
  workspaceId: number | null;
  open: (workspaceId: number) => void;
  close: () => void;
};

export const useCreateProjectModal = create<CreateProjectModalStore>((set) => ({
  isOpen: false,
  workspaceId: null,
  open: (workspaceId) => set({ isOpen: true, workspaceId: workspaceId }),
  close: () => set({ isOpen: false, workspaceId: null }),
}));
