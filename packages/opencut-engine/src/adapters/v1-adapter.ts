/**
 * V1 Adapter
 *
 * Adapter for current OpenCut project format.
 * Translates between OpenCut format and our normalized schema.
 */

import type {
  NormalizedProject,
  NormalizedTrack,
  NormalizedElement,
  VersionAdapter,
  MediaManifest,
} from "../types";

export class V1Adapter implements VersionAdapter {
  readonly version = "1.x";
  readonly compatibleVersions = ["1.0", "1.1", "1.2"];

  getProjectVersion(project: unknown): string | null {
    // OpenCut projects may have version in metadata
    if (typeof project === "object" && project !== null) {
      const p = project as Record<string, unknown>;
      if (typeof p.version === "string") {
        return p.version;
      }
    }
    return "1.0"; // Default to 1.0 for legacy projects
  }

  toNormalized(opencutProject: unknown): NormalizedProject {
    const project = opencutProject as OpenCutProjectV1;

    return {
      version: "1.0",
      metadata: {
        id: project.id || generateId(),
        name: project.name || "Untitled Project",
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: project.updatedAt || new Date().toISOString(),
        duration: this.calculateDuration(project),
      },
      canvas: {
        width: project.width || 1920,
        height: project.height || 1080,
        fps: project.fps || 30,
        backgroundColor: project.backgroundColor || "#000000",
        backgroundType: project.backgroundType || "color",
      },
      tracks: this.normalizeTracks(project.tracks || []),
      mediaManifest: this.extractMediaManifest(project),
    };
  }

  fromNormalized(project: NormalizedProject): unknown {
    return {
      id: project.metadata.id,
      name: project.metadata.name,
      createdAt: project.metadata.createdAt,
      updatedAt: new Date().toISOString(),
      width: project.canvas.width,
      height: project.canvas.height,
      fps: project.canvas.fps,
      backgroundColor: project.canvas.backgroundColor,
      backgroundType: project.canvas.backgroundType,
      tracks: project.tracks.map((track) => this.denormalizeTrack(track)),
    };
  }

  private normalizeTracks(tracks: OpenCutTrackV1[]): NormalizedTrack[] {
    return tracks.map((track, index) => ({
      id: track.id || generateId(),
      type: this.normalizeTrackType(track.type),
      order: track.order ?? index,
      muted: track.muted ?? false,
      locked: track.locked ?? false,
      elements: (track.elements || []).map((el) => this.normalizeElement(el)),
    }));
  }

  private normalizeTrackType(
    type: string
  ): "main" | "video" | "audio" | "text" | "image" {
    const typeMap: Record<string, NormalizedTrack["type"]> = {
      main: "main",
      video: "video",
      audio: "audio",
      text: "text",
      image: "image",
      media: "video", // Fallback for generic media
    };
    return typeMap[type] || "video";
  }

  private normalizeElement(element: OpenCutElementV1): NormalizedElement {
    return {
      id: element.id || generateId(),
      type: element.type as NormalizedElement["type"],
      startTime: element.startTime || 0,
      duration: element.duration || 0,
      trimStart: element.trimStart || 0,
      trimEnd: element.trimEnd || 0,
      mediaId: element.mediaId,
      textContent: element.content,
      textStyle: element.style
        ? {
            fontFamily: element.style.fontFamily || "Inter",
            fontSize: element.style.fontSize || 48,
            fontWeight: element.style.fontWeight || 400,
            color: element.style.color || "#ffffff",
            backgroundColor: element.style.backgroundColor,
            textAlign: element.style.textAlign || "center",
          }
        : undefined,
      transform: element.transform
        ? {
            x: element.transform.x || 0,
            y: element.transform.y || 0,
            width: element.transform.width || 100,
            height: element.transform.height || 100,
            rotation: element.transform.rotation || 0,
            scale: element.transform.scale || 1,
            opacity: element.transform.opacity ?? 1,
          }
        : undefined,
    };
  }

  private denormalizeTrack(track: NormalizedTrack): OpenCutTrackV1 {
    return {
      id: track.id,
      type: track.type,
      order: track.order,
      muted: track.muted,
      locked: track.locked,
      elements: track.elements.map((el) => this.denormalizeElement(el)),
    };
  }

  private denormalizeElement(element: NormalizedElement): OpenCutElementV1 {
    return {
      id: element.id,
      type: element.type,
      startTime: element.startTime,
      duration: element.duration,
      trimStart: element.trimStart,
      trimEnd: element.trimEnd,
      mediaId: element.mediaId,
      content: element.textContent,
      style: element.textStyle
        ? {
            fontFamily: element.textStyle.fontFamily,
            fontSize: element.textStyle.fontSize,
            fontWeight: element.textStyle.fontWeight,
            color: element.textStyle.color,
            backgroundColor: element.textStyle.backgroundColor,
            textAlign: element.textStyle.textAlign,
          }
        : undefined,
      transform: element.transform,
    };
  }

  private calculateDuration(project: OpenCutProjectV1): number {
    let maxEnd = 0;
    for (const track of project.tracks || []) {
      for (const element of track.elements || []) {
        const endTime = (element.startTime || 0) + (element.duration || 0);
        if (endTime > maxEnd) maxEnd = endTime;
      }
    }
    return maxEnd;
  }

  private extractMediaManifest(project: OpenCutProjectV1): MediaManifest {
    // Extract unique media references from project
    const mediaItems = new Map<string, any>();

    for (const track of project.tracks || []) {
      for (const element of track.elements || []) {
        if (element.mediaId && !mediaItems.has(element.mediaId)) {
          mediaItems.set(element.mediaId, {
            id: element.mediaId,
            name: element.name || element.mediaId,
            type: element.type,
            path: element.src || "",
            duration: element.mediaDuration,
            size: 0,
            mimeType: "",
          });
        }
      }
    }

    return {
      items: Array.from(mediaItems.values()),
    };
  }
}

// ============================================
// Internal OpenCut V1 Types
// ============================================

interface OpenCutProjectV1 {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  width?: number;
  height?: number;
  fps?: number;
  backgroundColor?: string;
  backgroundType?: "color" | "blur";
  tracks?: OpenCutTrackV1[];
}

interface OpenCutTrackV1 {
  id?: string;
  type: string;
  order?: number;
  muted?: boolean;
  locked?: boolean;
  elements?: OpenCutElementV1[];
}

interface OpenCutElementV1 {
  id?: string;
  type: string;
  name?: string;
  startTime?: number;
  duration?: number;
  trimStart?: number;
  trimEnd?: number;
  mediaId?: string;
  src?: string;
  mediaDuration?: number;
  content?: string;
  style?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    color?: string;
    backgroundColor?: string;
    textAlign?: "left" | "center" | "right";
  };
  transform?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    rotation?: number;
    scale?: number;
    opacity?: number;
  };
}

// ============================================
// Helpers
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
