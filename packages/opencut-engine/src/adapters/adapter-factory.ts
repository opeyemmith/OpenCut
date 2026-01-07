/**
 * Adapter Factory
 *
 * Creates the appropriate version adapter based on project version.
 */

import type { VersionAdapter } from "../types";
import { V1Adapter } from "./v1-adapter";

// Registry of available adapters
const adapters: Record<string, () => VersionAdapter> = {
  "1.x": () => new V1Adapter(),
  // Future: "2.x": () => new V2Adapter(),
};

/**
 * Create an adapter for the specified version
 */
export function createAdapter(version: string): VersionAdapter {
  // Try exact match first
  if (adapters[version]) {
    return adapters[version]();
  }

  // Try major version match (e.g., "1.0" -> "1.x")
  const majorVersion = version.split(".")[0] + ".x";
  if (adapters[majorVersion]) {
    return adapters[majorVersion]();
  }

  // Default to latest (V1 for now)
  console.warn(
    `[OpenCut Bridge] Unknown version "${version}", falling back to V1 adapter`
  );
  return new V1Adapter();
}

/**
 * Get the default adapter (current version)
 */
export function getDefaultAdapter(): VersionAdapter {
  return new V1Adapter();
}

/**
 * Check if a version is supported
 */
export function isVersionSupported(version: string): boolean {
  const majorVersion = version.split(".")[0] + ".x";
  return version in adapters || majorVersion in adapters;
}

/**
 * List all supported versions
 */
export function getSupportedVersions(): string[] {
  return Object.keys(adapters);
}
