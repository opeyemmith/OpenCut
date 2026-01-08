/**
 * ClipFactory Project Schema
 *
 * This is the unified project format used as the common language between:
 * - AI Workers (generate projects)
 * - OpenCut Editor (edit projects)
 * - Render Engine (export projects)
 *
 * All components must read and write this format.
 */

// ============================================
// Core Project Structure
// ============================================

export interface ClipFactoryProject {
  /** Schema version for forward/backward compatibility */
  version: string;
  /** Project metadata */
  metadata: ProjectMetadata;
  /** Canvas/viewport settings */
  canvas: ProjectCanvas;
  /** Timeline tracks */
  tracks: ProjectTrack[];
  /** Asset manifest - all media referenced by elements */
  assets: AssetManifest;
}

// ============================================
// Metadata
// ============================================

export interface ProjectMetadata {
  /** Unique project ID */
  id: string;
  /** Human-readable name */
  name: string;
  /** Optional description */
  description?: string;
  /** ISO timestamp of creation */
  createdAt: string;
  /** ISO timestamp of last update */
  updatedAt: string;
  /** Total duration in seconds */
  duration: number;
  /** If generated from a template, the template ID */
  templateId?: string;
  /** If AI-generated, the job ID that created it */
  generationJobId?: string;
}

// ============================================
// Canvas Settings
// ============================================

export interface ProjectCanvas {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Frames per second */
  fps: number;
  /** Background color (hex) */
  backgroundColor: string;
  /** Background type */
  backgroundType: "color" | "blur";
}

// ============================================
// Tracks
// ============================================

export interface ProjectTrack {
  /** Unique track ID */
  id: string;
  /** Track content type */
  type: TrackType;
  /** Semantic role of this track */
  role: TrackRole;
  /** Display order (0 = bottom) */
  order: number;
  /** Whether audio is muted */
  muted: boolean;
  /** Whether track is locked for editing */
  locked: boolean;
  /** Elements on this track */
  elements: ProjectElement[];
}

export type TrackType = "video" | "audio" | "text" | "image";

export type TrackRole =
  | "main_video"
  | "b_roll"
  | "overlay"
  | "background_music"
  | "voiceover"
  | "sound_effect"
  | "caption"
  | "title";

// ============================================
// Elements
// ============================================

export interface ProjectElement {
  /** Unique element ID */
  id: string;
  /** Element type */
  type: ElementType;
  /** Display name */
  name: string;
  /** Start time on timeline in seconds */
  startTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Trim from start of source media */
  trimStart: number;
  /** Trim from end of source media */
  trimEnd: number;

  // Media-specific
  /** Reference to asset in manifest */
  assetId?: string;

  // Text-specific
  /** Text content for text elements */
  textContent?: string;
  /** Text styling */
  textStyle?: ProjectTextStyle;

  // Transform
  /** Position and transform properties */
  transform?: ElementTransform;

  // Visibility
  /** Whether audio is muted (for video/audio) */
  muted?: boolean;
  /** Whether element is hidden */
  hidden?: boolean;
}

export type ElementType = "media" | "text" | "audio" | "image";

export interface ElementTransform {
  /** X position (pixels from left) */
  x: number;
  /** Y position (pixels from top) */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Rotation in degrees */
  rotation: number;
  /** Scale factor (1 = 100%) */
  scale: number;
  /** Opacity (0-1) */
  opacity: number;
}

export interface ProjectTextStyle {
  /** Font family name */
  fontFamily: string;
  /** Font size in pixels */
  fontSize: number;
  /** Font weight (100-900) */
  fontWeight: number;
  /** Text color (hex) */
  color: string;
  /** Background color (hex, optional) */
  backgroundColor?: string;
  /** Text alignment */
  textAlign: "left" | "center" | "right";
}

// ============================================
// Assets
// ============================================

export interface AssetManifest {
  /** All assets used in the project */
  items: AssetItem[];
}

export interface AssetItem {
  /** Unique asset ID (referenced by elements) */
  id: string;
  /** Display name */
  name: string;
  /** Asset type */
  type: AssetType;
  /** URL or local path to the asset */
  path: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** Duration in seconds (video/audio only) */
  duration?: number;
  /** Width in pixels (video/image only) */
  width?: number;
  /** Height in pixels (video/image only) */
  height?: number;
}

export type AssetType = "video" | "audio" | "image";

// ============================================
// Factory Functions
// ============================================

/**
 * Create an empty project with default settings.
 */
export function createEmptyProject(name: string = "Untitled Project"): ClipFactoryProject {
  const now = new Date().toISOString();
  return {
    version: "1.0",
    metadata: {
      id: generateProjectId(),
      name,
      createdAt: now,
      updatedAt: now,
      duration: 0,
    },
    canvas: {
      width: 1920,
      height: 1080,
      fps: 30,
      backgroundColor: "#000000",
      backgroundType: "color",
    },
    tracks: [],
    assets: { items: [] },
  };
}

/**
 * Generate a unique project ID.
 */
function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
