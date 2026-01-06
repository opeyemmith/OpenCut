"use client";

import { useCallback, useEffect } from "react";
import { useAutomationStore } from "../stores/automation-store";
import type {
  AutomationTemplate,
  AutomationInputs,
  GeneratedProject,
} from "@opencut/automation";

/**
 * Hook for using automation features in components.
 * Provides a simplified API for common automation workflows.
 */
export function useAutomation() {
  const store = useAutomationStore();

  // Load templates on mount
  useEffect(() => {
    store.loadTemplates();
  }, []);

  /**
   * Open the save template dialog for the current project.
   */
  const openSaveDialog = useCallback(
    (project: any, tracks: any[], mediaFiles: any[]) => {
      store.openExtractDialog(project, tracks, mediaFiles);
    },
    [store]
  );

  /**
   * Open the template selector dialog.
   */
  const openTemplateSelector = useCallback(() => {
    store.openTemplateSelector();
  }, [store]);

  /**
   * Apply a template to create a new project.
   */
  const applyTemplate = useCallback(
    async (
      template: AutomationTemplate,
      inputs: AutomationInputs
    ): Promise<GeneratedProject> => {
      return store.applyTemplate(template, inputs);
    },
    [store]
  );

  /**
   * Get a template by ID.
   */
  const getTemplate = useCallback(
    async (id: string): Promise<AutomationTemplate | null> => {
      return store.loadTemplate(id);
    },
    [store]
  );

  return {
    // State
    templates: store.templates,
    currentTemplate: store.currentTemplate,
    isLoading: store.isLoading,
    isSaving: store.isSaving,
    error: store.error,

    // Dialog states
    isExtractDialogOpen: store.isExtractDialogOpen,
    isApplyDialogOpen: store.isApplyDialogOpen,
    isTemplateSelectorOpen: store.isTemplateSelectorOpen,
    extractionSource: store.extractionSource,

    // Actions
    openSaveDialog,
    openTemplateSelector,
    applyTemplate,
    getTemplate,
    loadTemplates: store.loadTemplates,
    closeExtractDialog: store.closeExtractDialog,
    closeApplyDialog: store.closeApplyDialog,
    closeTemplateSelector: store.closeTemplateSelector,
    clearError: store.clearError,

    // Template management
    deleteTemplate: store.deleteTemplate,
    duplicateTemplate: store.duplicateTemplate,
    exportTemplate: store.exportTemplate,
    importTemplate: store.importTemplate,
  };
}
