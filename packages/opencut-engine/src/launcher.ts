/**
 * OpenCut Editor Launcher
 *
 * Launches OpenCut editor in a separate browser tab.
 * This approach avoids iframe/embedding issues (CORS, security sandbox).
 */

import { getEventBus } from "@clipfactory/events";
import type { LaunchOptions } from "./types";

// ============================================
// Configuration
// ============================================

export interface LauncherConfig {
  /**
   * Base URL for OpenCut editor
   * Default: same origin on different port
   */
  baseUrl?: string;
}

// Default to localhost:3000 (OpenCut web runs there)
const DEFAULT_BASE_URL = "http://localhost:3000";

let config: LauncherConfig = {
  baseUrl: DEFAULT_BASE_URL,
};

/**
 * Configure the launcher
 */
export function configureLauncher(newConfig: Partial<LauncherConfig>): void {
  config = { ...config, ...newConfig };
}

// ============================================
// Launcher Functions
// ============================================

/**
 * Launch OpenCut editor with a specific project
 *
 * @param projectId - The project ID to open
 * @param options - Launch options
 * @returns The opened window reference (or null if blocked)
 */
export function launchEditor(
  projectId: string,
  options?: LaunchOptions
): Window | null {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  // Build the editor URL with query params
  const url = new URL(`/editor/${projectId}`, baseUrl);

  if (options?.mode) {
    url.searchParams.set("mode", options.mode);
  }

  if (options?.autoSave !== undefined) {
    url.searchParams.set("autoSave", String(options.autoSave));
  }

  // Open in new tab
  const editorWindow = window.open(url.toString(), "_blank");

  // Emit event
  getEventBus().emit({
    type: "project:handoff",
    projectId,
    url: url.toString(),
  });

  return editorWindow;
}

/**
 * Launch OpenCut to create a new project
 *
 * @param projectName - Name for the new project
 * @returns The opened window reference
 */
export function launchNewProject(projectName?: string): Window | null {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  const url = new URL("/editor/new", baseUrl);

  if (projectName) {
    url.searchParams.set("name", projectName);
  }

  const editorWindow = window.open(url.toString(), "_blank");

  return editorWindow;
}

/**
 * Launch OpenCut projects page
 */
export function launchProjectsBrowser(): Window | null {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;
  const url = new URL("/projects", baseUrl);

  return window.open(url.toString(), "_blank");
}

/**
 * Check if OpenCut is available at the configured URL
 */
export async function isOpenCutAvailable(): Promise<boolean> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/health`, {
      method: "HEAD",
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
}
