import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dbAdapter } from '@/adapters/indexed-db';

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
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
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
  removeTemplate: (id: string) => void; // Added alias to match interface

  // Project actions
  addProject: (project: DashboardProject) => void;
  updateProject: (id: string, updates: Partial<DashboardProject>) => void;
  deleteProject: (id: string) => void;
  updateProjectStatus: (id: string, status: DashboardProject['status']) => void;

  // Loading & Persistence
  setLoading: (loading: boolean) => void;
  loadInitialData: () => Promise<void>;
}

// ============================================
// Store Implementation
// ============================================

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],
  projects: [],
  isLoading: false,
  selectedTemplateId: null,

  addTemplate: (template) => {
    set((state) => ({
      templates: [template, ...state.templates],
    }));
    // Async DB update
    dbAdapter.set(`templates:${template.id}`, template);
  },

  updateTemplate: (id, updates) => {
    set((state) => {
      const newTemplates = state.templates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      );
      // Find updated item to persist
      const updatedItem = newTemplates.find(t => t.id === id);
      if (updatedItem) dbAdapter.set(`templates:${id}`, updatedItem);
      return { templates: newTemplates };
    });
  },

  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((t) => t.id !== id),
    }));
    dbAdapter.delete(`templates:${id}`);
  },

  // Alias for compatibility if needed, or standardized
  removeTemplate: (id) => get().deleteTemplate(id),

  selectTemplate: (id) =>
    set({ selectedTemplateId: id }),

  addProject: (project) => {
    set((state) => ({
      projects: [project, ...state.projects],
    }));
    dbAdapter.set(`projects:${project.id}`, project);
  },

  updateProject: (id, updates) => {
    set((state) => {
      const newProjects = state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      );
      const updatedItem = newProjects.find(p => p.id === id);
      if (updatedItem) dbAdapter.set(`projects:${id}`, updatedItem);
      return { projects: newProjects };
    });
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
    dbAdapter.delete(`projects:${id}`);
  },

  updateProjectStatus: (id, status) => {
    get().updateProject(id, { status });
  },

  setLoading: (loading) =>
    set({ isLoading: loading }),

  loadInitialData: async () => {
    set({ isLoading: true });
    try {
      const templateKeys = await dbAdapter.list("templates");
      const projectKeys = await dbAdapter.list("projects");
      
      const templates = await Promise.all(templateKeys.map(key => dbAdapter.get<DashboardTemplate>(key)));
      const projects = await Promise.all(projectKeys.map(key => dbAdapter.get<DashboardProject>(key)));
      
      // Filter out nulls and sort
      const validTemplates = templates.filter((t): t is DashboardTemplate => t !== null)
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
      const validProjects = projects.filter((p): p is DashboardProject => p !== null)
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      set({ 
        templates: validTemplates,
        projects: validProjects,
        isLoading: false
      });
    } catch (e) {
      console.error("Failed to load initial data", e);
      set({ isLoading: false });
    }
  }
}));
