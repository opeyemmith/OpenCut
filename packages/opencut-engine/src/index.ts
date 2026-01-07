/**
 * @clipfactory/opencut-engine
 *
 * OpenCut integration bridge for ClipFactory platform.
 * Provides a stable boundary between our platform and OpenCut.
 *
 * Key Features:
 * - Version adapters for schema translation
 * - Separate tab launcher (no iframe/embedding)
 * - Normalized project format
 * - Media manifest extraction
 *
 * @example
 * ```typescript
 * import { launchEditor, createAdapter } from '@clipfactory/opencut-engine';
 *
 * // Launch OpenCut in new tab
 * launchEditor('project-123');
 *
 * // Convert project to normalized format
 * const adapter = createAdapter('1.0');
 * const normalized = adapter.toNormalized(opencutProject);
 * ```
 */

// Types
export * from "./types";

// Adapters
export {
  V1Adapter,
  createAdapter,
  getDefaultAdapter,
  isVersionSupported,
  getSupportedVersions,
} from "./adapters";

// Launcher
export {
  launchEditor,
  launchNewProject,
  launchProjectsBrowser,
  isOpenCutAvailable,
  configureLauncher,
  type LauncherConfig,
} from "./launcher";
