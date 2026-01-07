/**
 * Dashboard Template Store
 *
 * Manages template state for the ClipFactory dashboard.
 * Uses IndexedDB for persistence through a web storage adapter.
 */

import { create } from "zustand";

// ============================================
// Types
// ============================================

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  placeholderCount: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  // The raw template data from automation package
  templateData?: unknown;
}

export interface DashboardProject {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateStore {
  // State
  templates: DashboardTemplate[];
  projects: DashboardProject[];
  isLoading: boolean;
  selectedTemplateId: string | null;

  // Template actions
  addTemplate: (template: DashboardTemplate) => void;
  updateTemplate: (id: string, updates: Partial<DashboardTemplate>) => void;
  deleteTemplate: (id: string) => void;
  selectTemplate: (id: string | null) => void;

  // Project actions
  addProject: (project: DashboardProject) => void;
  updateProject: (id: string, updates: Partial<DashboardProject>) => void;
  deleteProject: (id: string) => void;

  // Loading
  setLoading: (loading: boolean) => void;
}

// ============================================
// Store Implementation
// ============================================

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  projects: [],
  isLoading: false,
  selectedTemplateId: null,

  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template],
    })),

  updateTemplate: (id, updates) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    })),

  selectTemplate: (id) =>
    set({ selectedTemplateId: id }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

  setLoading: (loading) =>
    set({ isLoading: loading }),
}));

// ============================================
// Selectors
// ============================================

export const useTemplates = () => useTemplateStore((state) => state.templates);
export const useProjects = () => useTemplateStore((state) => state.projects);
export const useSelectedTemplate = () => {
  const templates = useTemplateStore((state) => state.templates);
  const selectedId = useTemplateStore((state) => state.selectedTemplateId);
  return templates.find((t) => t.id === selectedId) || null;
};
