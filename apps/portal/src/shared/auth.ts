import { create } from "zustand";

export const useAuth = create<Auth>()((set) => ({
  username: undefined,
  workspaceId: undefined,
  role: undefined,
  setUser: (username: string) => {
    set((state) => ({
      ...state,
      username,
      workspaceId: undefined,
      role: undefined,
    }));
  },
  setWorkspace(workspace?: { id: string; role: string }) {
    if (!workspace) {
      set((state) => ({
        ...state,
        workspaceId: undefined,
        role: undefined,
      }));
      return;
    }
    console.log(workspace);
    set((state) => ({
      ...state,
      workspaceId: workspace.id,
      role: workspace.role,
    }));
  },
  logout() {
    set(() => ({
      username: undefined,
      workspaceId: undefined,
      role: undefined,
    }));
  },
}));

export type Auth = {
  setUser: (username: string) => void;
  setWorkspace: (setWorkspace?: { id: string; role: string }) => void;
  logout: () => void;
  username?: string;
  workspaceId?: string;
  role?: string;
};
