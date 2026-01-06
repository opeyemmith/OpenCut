/**
 * Web Automation Module
 *
 * Entry point for automation features in the web app.
 * Initializes adapters and provides the automation system.
 */

// Re-export from core package
export {
  // Types
  type AutomationTemplate,
  type TemplateSummary,
  type PlaceholderDefinition,
  type PlaceholderInput,
  type AutomationInputs,
  type AutomationRule,
  type GeneratedProject,

  // Feature flags
  DEFAULT_FEATURE_FLAGS,
  isFeatureEnabled,
  createFeatureFlags,
  type AutomationFeatureFlags,

  // Core classes
  TemplateExtractor,
  TemplateInterpreter,
  createExtractor,
  createInterpreter,

  // Validation
  validateTemplate,
  validatePlaceholderInputs,
  isValidTemplate,
} from "@opencut/automation";

// Web-specific exports
export { WebStorageAdapter, createWebStorageAdapter } from "./adapters/web-storage-adapter";
export { useAutomationStore, useTemplateById, useHasTemplates } from "./stores/automation-store";

// Hooks
export { useAutomation } from "./hooks/use-automation";

// Components
export { SaveTemplateDialog } from "./components/save-template-dialog";
export { TemplateSelector } from "./components/template-selector";
export { PlaceholderForm } from "./components/placeholder-form";
