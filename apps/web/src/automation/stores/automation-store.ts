/**
 * Automation Store
 *
 * Zustand store for managing automation state in the web app.
 * Handles template management, extraction, and application.
 */

import { create } from "zustand";
import {
  TemplateExtractor,
  TemplateInterpreter,
  validateTemplate,
  type AutomationTemplate,
  type TemplateSummary,
  type AutomationInputs,
  type GeneratedProject,
  type OpenCutProject,
  type OpenCutTrack,
  type MediaFileInfo,
  type ExtractionOptions,
} from "@opencut/automation";
import {
  WebStorageAdapter,
  createWebStorageAdapter,
} from "../adapters/web-storage-adapter";

// ============================================================
// Store State Types
// ============================================================

interface AutomationState {
  // Data
  templates: TemplateSummary[];
  selectedTemplateId: string | null;
  currentTemplate: AutomationTemplate | null;

  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Dialog states
  isExtractDialogOpen: boolean;
  isApplyDialogOpen: boolean;
  isTemplateSelectorOpen: boolean;

  // Source data for extraction
  extractionSource: {
    project: OpenCutProject | null;
    tracks: OpenCutTrack[];
    mediaFiles: MediaFileInfo[];
  } | null;
}

interface AutomationActions {
  // Template management
  loadTemplates: () => Promise<void>;
  loadTemplate: (id: string) => Promise<AutomationTemplate | null>;
  saveTemplate: (template: AutomationTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  duplicateTemplate: (id: string, newName: string) => Promise<void>;
  updateTemplateMetadata: (id: string, updates: { name?: string; description?: string }) => Promise<void>;

  // Template extraction
  extractTemplate: (
    project: OpenCutProject,
    tracks: OpenCutTrack[],
    mediaFiles: MediaFileInfo[],
    options?: ExtractionOptions
  ) => Promise<AutomationTemplate>;

  // Template application
  applyTemplate: (
    template: AutomationTemplate,
    inputs: AutomationInputs
  ) => Promise<GeneratedProject>;

  // Import/Export
  exportTemplate: (id: string) => Promise<string>;
  importTemplate: (json: string) => Promise<AutomationTemplate>;

  // UI state management
  setSelectedTemplate: (id: string | null) => void;
  openExtractDialog: (
    project: OpenCutProject,
    tracks: OpenCutTrack[],
    mediaFiles: MediaFileInfo[]
  ) => void;
  closeExtractDialog: () => void;
  openApplyDialog: (templateId: string) => Promise<void>;
  closeApplyDialog: () => void;
  openTemplateSelector: () => void;
  closeTemplateSelector: () => void;
  clearError: () => void;
}

type AutomationStore = AutomationState & AutomationActions;

// ============================================================
// Store Implementation
// ============================================================

// Singleton instances
const storageAdapter: WebStorageAdapter = createWebStorageAdapter();
const extractor = new TemplateExtractor();
const interpreter = new TemplateInterpreter();

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  // Initial state
  templates: [],
  selectedTemplateId: null,
  currentTemplate: null,
  isLoading: false,
  isSaving: false,
  error: null,
  isExtractDialogOpen: false,
  isApplyDialogOpen: false,
  isTemplateSelectorOpen: false,
  extractionSource: null,

  // Load all templates
  loadTemplates: async () => {
    set({ isLoading: true, error: null });

    try {
      const templates = await storageAdapter.listTemplates();
      set({ templates, isLoading: false });
    } catch (error) {
      console.error("Failed to load templates:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to load templates",
        isLoading: false,
      });
    }
  },

  // Load a single template
  loadTemplate: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const template = await storageAdapter.loadTemplate(id);
      if (template) {
        set({ currentTemplate: template, isLoading: false });
      } else {
        set({ error: "Template not found", isLoading: false });
      }
      return template;
    } catch (error) {
      console.error("Failed to load template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to load template",
        isLoading: false,
      });
      return null;
    }
  },

  // Save a template
  saveTemplate: async (template: AutomationTemplate) => {
    set({ isSaving: true, error: null });

    try {
      // Validate before saving
      const validation = validateTemplate(template);
      if (!validation.isValid) {
        throw new Error(validation.errors.map((e) => e.message).join(", "));
      }

      await storageAdapter.saveTemplate(template);

      // Refresh the list
      await get().loadTemplates();

      set({ isSaving: false, currentTemplate: template });
    } catch (error) {
      console.error("Failed to save template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to save template",
        isSaving: false,
      });
      throw error;
    }
  },

  // Delete a template
  deleteTemplate: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await storageAdapter.deleteTemplate(id);

      // Clear selection if deleted
      const { selectedTemplateId, currentTemplate } = get();
      if (selectedTemplateId === id) {
        set({ selectedTemplateId: null });
      }
      if (currentTemplate?.id === id) {
        set({ currentTemplate: null });
      }

      // Refresh the list
      await get().loadTemplates();
    } catch (error) {
      console.error("Failed to delete template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to delete template",
        isLoading: false,
      });
      throw error;
    }
  },

  // Duplicate a template
  duplicateTemplate: async (id: string, newName: string) => {
    set({ isSaving: true, error: null });

    try {
      await storageAdapter.duplicateTemplate(id, newName);
      await get().loadTemplates();
      set({ isSaving: false });
    } catch (error) {
      console.error("Failed to duplicate template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to duplicate template",
        isSaving: false,
      });
      throw error;
    }
  },

  // Update template metadata
  updateTemplateMetadata: async (id: string, updates: { name?: string; description?: string }) => {
    set({ isSaving: true, error: null });

    try {
      const template = await storageAdapter.loadTemplate(id);
      if (!template) {
        throw new Error("Template not found");
      }

      const updatedTemplate = {
        ...template,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await storageAdapter.saveTemplate(updatedTemplate);
      
      // Update current template if it's the one being edited
      const { currentTemplate } = get();
      if (currentTemplate?.id === id) {
          set({ currentTemplate: updatedTemplate });
      }

      await get().loadTemplates();
      set({ isSaving: false });
    } catch (error) {
      console.error("Failed to update template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to update template",
        isSaving: false,
      });
      throw error;
    }
  },

  // Extract template from project
  extractTemplate: async (
    project: OpenCutProject,
    tracks: OpenCutTrack[],
    mediaFiles: MediaFileInfo[],
    options?: ExtractionOptions
  ) => {
    set({ isLoading: true, error: null });

    try {
      const template = extractor.extract(project, tracks, mediaFiles, options);

      // Save the extracted template
      await storageAdapter.saveTemplate(template);

      // Refresh the list
      await get().loadTemplates();

      set({
        isLoading: false,
        currentTemplate: template,
        isExtractDialogOpen: false,
        extractionSource: null,
      });

      return template;
    } catch (error) {
      console.error("Failed to extract template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to extract template",
        isLoading: false,
      });
      throw error;
    }
  },

  // Apply template with inputs
  applyTemplate: async (
    template: AutomationTemplate,
    inputs: AutomationInputs
  ) => {
    set({ isLoading: true, error: null });

    try {
      const result = await interpreter.apply(template, inputs);

      set({ isLoading: false, isApplyDialogOpen: false });

      return result;
    } catch (error) {
      console.error("Failed to apply template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to apply template",
        isLoading: false,
      });
      throw error;
    }
  },

  // Export template as JSON
  exportTemplate: async (id: string) => {
    try {
      return await storageAdapter.exportTemplate(id);
    } catch (error) {
      console.error("Failed to export template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to export template",
      });
      throw error;
    }
  },

  // Import template from JSON
  importTemplate: async (json: string) => {
    set({ isLoading: true, error: null });

    try {
      const template = await storageAdapter.importTemplate(json);
      await get().loadTemplates();
      set({ isLoading: false });
      return template;
    } catch (error) {
      console.error("Failed to import template:", error);
      set({
        error: error instanceof Error ? error.message : "Failed to import template",
        isLoading: false,
      });
      throw error;
    }
  },

  // UI state management
  setSelectedTemplate: (id: string | null) => {
    set({ selectedTemplateId: id });
  },

  openExtractDialog: (project, tracks, mediaFiles) => {
    set({
      isExtractDialogOpen: true,
      extractionSource: { project, tracks, mediaFiles },
    });
  },

  closeExtractDialog: () => {
    set({
      isExtractDialogOpen: false,
      extractionSource: null,
    });
  },

  openApplyDialog: async (templateId: string) => {
    await get().loadTemplate(templateId);
    set({ isApplyDialogOpen: true, selectedTemplateId: templateId });
  },

  closeApplyDialog: () => {
    set({ isApplyDialogOpen: false });
  },

  openTemplateSelector: () => {
    set({ isTemplateSelectorOpen: true });
  },

  closeTemplateSelector: () => {
    set({ isTemplateSelectorOpen: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// ============================================================
// Selector Hooks
// ============================================================

/**
 * Get template by ID from the list.
 */
export function useTemplateById(id: string | null): TemplateSummary | undefined {
  return useAutomationStore((state) =>
    id ? state.templates.find((t) => t.id === id) : undefined
  );
}

/**
 * Check if automation is available (has templates).
 */
export function useHasTemplates(): boolean {
  return useAutomationStore((state) => state.templates.length > 0);
}
