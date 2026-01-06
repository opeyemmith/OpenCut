/**
 * @opencut/automation
 *
 * Template-driven AI automation engine for OpenCut.
 * This package contains platform-agnostic core logic that can be used
 * across web, desktop (Tauri), and mobile platforms.
 *
 * @example
 * ```typescript
 * import { TemplateExtractor, TemplateInterpreter } from '@opencut/automation';
 * import { WebStorageAdapter } from './adapters/web-storage-adapter';
 *
 * // Create platform-specific adapter
 * const storage = new WebStorageAdapter();
 *
 * // Use core logic with injected adapter
 * const extractor = new TemplateExtractor();
 * const template = extractor.extract(project, timeline);
 *
 * await storage.saveTemplate(template);
 * ```
 */

// Types
export * from "./types/index";

// Core logic
export * from "./core/index";

// Utilities
export * from "./utils/index";

// Feature flags
export * from "./feature-flags";
