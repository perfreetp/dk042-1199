import { create } from 'zustand';
import type { Requirement, RequirementStatus, Priority, RequirementCategory } from '../types';

interface AppState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  currentRequirement: Requirement | null;
  setCurrentRequirement: (req: Requirement | null) => void;
  
  filters: {
    hospital: string;
    department: string;
    deviceModel: string;
    status: RequirementStatus | 'all';
    priority: Priority | 'all';
    category: RequirementCategory | 'all';
    keyword: string;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
  resetFilters: () => void;
}

const useStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  currentRequirement: null,
  setCurrentRequirement: (req) => set({ currentRequirement: req }),
  
  filters: {
    hospital: 'all',
    department: 'all',
    deviceModel: 'all',
    status: 'all',
    priority: 'all',
    category: 'all',
    keyword: '',
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () =>
    set({
      filters: {
        hospital: 'all',
        department: 'all',
        deviceModel: 'all',
        status: 'all',
        priority: 'all',
        category: 'all',
        keyword: '',
      },
    }),
}));

export default useStore;
