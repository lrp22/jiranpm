import { create } from "zustand";
import type { RouterOutput } from "@/utils/trpc";

type Project = RouterOutput["project"]["getAllByWorkspace"][number];

type EditProjectModalStore = {
  isOpen: boolean;
  project: Project | null;
  open: (project: Project) => void;
  close: () => void;
};

export const useEditProjectModal = create<EditProjectModalStore>((set) => ({
  isOpen: false,
  project: null,
  open: (project) => set({ isOpen: true, project }),
  close: () => set({ isOpen: false, project: null }),
}));
