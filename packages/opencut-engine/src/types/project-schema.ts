/**
 * OpenCut Project Schema Types
 *
 * These types represent the NORMALIZED format we use internally.
 * The version adapters translate to/from actual OpenCut format.
 */

// ============================================
// Normalized Project (Our Format)
// ============================================

export interface NormalizedProject {
  version: string;
  metadata: ProjectMetadata;
  canvas: CanvasSettings;
  tracks: NormalizedTrack[];
  mediaManifest: MediaManifest;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
}

export interface CanvasSettings {
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  backgroundType: "color" | "blur";
}

export interface NormalizedTrack {
  id: string;
  type: "main" | "video" | "audio" | "text" | "image";
  order: number;
  muted: boolean;
  locked: boolean;
  elements: NormalizedElement[];
}

export interface NormalizedElement {
  id: string;
  type: "video" | "audio" | "text" | "image";
  startTime: number;
  duration: number;
  trimStart: number;
  trimEnd: number;

  // Media reference (for video/audio/image)
  mediaId?: string;

  // Text properties
  textContent?: string;
  textStyle?: TextStyleProperties;

  // Transform
  transform?: ElementTransform;
}

export interface TextStyleProperties {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  backgroundColor?: string;
  textAlign: "left" | "center" | "right";
}

export interface ElementTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  opacity: number;
}

// ============================================
// Media Manifest
// ============================================

export interface MediaManifest {
  items: MediaItem[];
}

export interface MediaItem {
  id: string;
  name: string;
  type: "video" | "audio" | "image";
  path: string;
  duration?: number;
  size: number;
  mimeType: string;
}

// ============================================
// Version Adapter Interface
// ============================================

export interface VersionAdapter {
  readonly version: string;
  readonly compatibleVersions: string[];

  /**
   * Convert OpenCut project format to normalized format
   */
  toNormalized(opencutProject: unknown): NormalizedProject;

  /**
   * Convert normalized format back to OpenCut format
   */
  fromNormalized(project: NormalizedProject): unknown;

  /**
   * Get the OpenCut version from a project
   */
  getProjectVersion(project: unknown): string | null;
}

// ============================================
// Export Settings
// ============================================

export interface ExportSettings {
  format: "mp4" | "webm" | "mov";
  quality: "low" | "medium" | "high" | "ultra";
  resolution?: { width: number; height: number };
  fps?: number;
}

export interface ExportJob {
  id: string;
  projectId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  outputPath?: string;
  error?: string;
}

// ============================================
// Launch Options
// ============================================

export interface LaunchOptions {
  mode?: "edit" | "preview" | "export";
  autoSave?: boolean;
}
