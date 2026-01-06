/**
 * Template Extractor
 *
 * Converts an OpenCut project into a reusable automation template.
 * This is a pure function that works with any platform.
 *
 * Key principles:
 * 1. Abstract concrete media to placeholders
 * 2. Preserve structure and timing relationships
 * 3. Extract style definitions for reuse
 * 4. Remove project-specific IDs
 */

import type {
  AutomationTemplate,
  CanvasSettings,
  TemplateTrack,
  TemplateElement,
  TrackRole,
  ElementTiming,
  ElementDuration,
  TemplateContent,
  TextStyleDefinition,
  CaptionStyleDefinition,
  CaptionAnimation,
  ElementPosition,
} from "../types/template";
import type { PlaceholderDefinition, PlaceholderType } from "../types/placeholder";
import type { AutomationRule } from "../types/rules";
import {
  generateId,
  getCurrentTimestamp,
  positionToPercent,
  generateUniqueName,
} from "../utils/template-utils";

// ============================================================
// Input Types (OpenCut project structure)
// ============================================================

/**
 * OpenCut project structure (simplified for extraction).
 * This matches the TProject type from OpenCut.
 */
export interface OpenCutProject {
  id: string;
  name: string;
  canvasSize: { width: number; height: number };
  backgroundColor?: string;
  backgroundType?: "color" | "blur";
  fps?: number;
}

/**
 * OpenCut timeline track.
 */
export interface OpenCutTrack {
  id: string;
  name: string;
  type: "media" | "text" | "audio";
  elements: OpenCutElement[];
  muted?: boolean;
  isMain?: boolean;
}

/**
 * OpenCut timeline element (media or text).
 */
export type OpenCutElement = OpenCutMediaElement | OpenCutTextElement;

/**
 * Media element from OpenCut.
 */
export interface OpenCutMediaElement {
  id: string;
  type: "media";
  name: string;
  mediaId: string;
  duration: number;
  startTime: number;
  trimStart: number;
  trimEnd: number;
  muted?: boolean;
  hidden?: boolean;
}

/**
 * Text element from OpenCut.
 */
export interface OpenCutTextElement {
  id: string;
  type: "text";
  name: string;
  content: string;
  duration: number;
  startTime: number;
  trimStart: number;
  trimEnd: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  textAlign: "left" | "center" | "right";
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline" | "line-through";
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  hidden?: boolean;
}

/**
 * Media file info for determining placeholder constraints.
 */
export interface MediaFileInfo {
  id: string;
  name: string;
  type: "video" | "audio" | "image";
  duration?: number;
  width?: number;
  height?: number;
}

// ============================================================
// Extraction Options
// ============================================================

/**
 * Options for template extraction.
 */
export interface ExtractionOptions {
  /** Name for the template */
  templateName?: string;

  /** Description for the template */
  templateDescription?: string;

  /** Whether to abstract text content to placeholders */
  abstractText?: boolean;

  /** Whether to infer track roles automatically */
  inferTrackRoles?: boolean;

  /** Whether to detect and extract caption styles */
  extractCaptionStyles?: boolean;

  /** Custom track role assignments */
  trackRoles?: Record<string, TrackRole>;
}

// ============================================================
// Template Extractor Class
// ============================================================

/**
 * Extracts automation templates from OpenCut projects.
 */
export class TemplateExtractor {
  private placeholders: PlaceholderDefinition[] = [];
  private captionStyles: CaptionStyleDefinition[] = [];
  private mediaIdToPlaceholder: Map<string, string> = new Map();
  private styleHashToId: Map<string, string> = new Map();

  /**
   * Extract a template from an OpenCut project.
   *
   * @param project - The OpenCut project
   * @param tracks - Timeline tracks
   * @param mediaFiles - Media file information
   * @param options - Extraction options
   * @returns The extracted automation template
   */
  extract(
    project: OpenCutProject,
    tracks: OpenCutTrack[],
    mediaFiles: MediaFileInfo[],
    options: ExtractionOptions = {}
  ): AutomationTemplate {
    // Reset state for new extraction
    this.placeholders = [];
    this.captionStyles = [];
    this.mediaIdToPlaceholder = new Map();
    this.styleHashToId = new Map();

    const {
      templateName = `Template from ${project.name}`,
      templateDescription = "",
      abstractText = false,
      inferTrackRoles = true,
      extractCaptionStyles = true,
      trackRoles = {},
    } = options;

    // Build media lookup
    const mediaMap = new Map(mediaFiles.map((m) => [m.id, m]));

    // Extract canvas settings
    const canvas = this.extractCanvasSettings(project);

    // Extract tracks with abstraction
    const templateTracks = tracks.map((track) =>
      this.extractTrack(track, mediaMap, {
        abstractText,
        inferTrackRoles,
        extractCaptionStyles,
        trackRoles,
        canvasSize: project.canvasSize,
      })
    );

    // Create the template
    const template: AutomationTemplate = {
      version: "1.0",
      id: generateId(),
      name: templateName,
      description: templateDescription,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      sourceProjectId: project.id,
      canvas,
      tracks: templateTracks,
      rules: [], // User adds rules after extraction
      captionStyles: this.captionStyles,
      placeholders: this.placeholders,
    };

    return template;
  }

  /**
   * Extract canvas settings from project.
   */
  private extractCanvasSettings(project: OpenCutProject): CanvasSettings {
    return {
      width: project.canvasSize.width,
      height: project.canvasSize.height,
      backgroundColor: project.backgroundColor || "#000000",
      backgroundType: project.backgroundType || "color",
      fps: project.fps || 30,
    };
  }

  /**
   * Extract a single track.
   */
  private extractTrack(
    track: OpenCutTrack,
    mediaMap: Map<string, MediaFileInfo>,
    options: {
      abstractText: boolean;
      inferTrackRoles: boolean;
      extractCaptionStyles: boolean;
      trackRoles: Record<string, TrackRole>;
      canvasSize: { width: number; height: number };
    }
  ): TemplateTrack {
    // Determine track role
    const role = options.trackRoles[track.id] ??
      (options.inferTrackRoles ? this.inferTrackRole(track) : "main_video");

    // Extract elements
    const elements = track.elements.map((element) =>
      this.extractElement(element, mediaMap, {
        abstractText: options.abstractText,
        extractCaptionStyles: options.extractCaptionStyles,
        canvasSize: options.canvasSize,
        trackRole: role,
      })
    );

    return {
      id: generateId(),
      name: track.name,
      type: track.type,
      role,
      elements,
      muted: track.muted,
      isMain: track.isMain,
    };
  }

  /**
   * Infer the semantic role of a track.
   */
  private inferTrackRole(track: OpenCutTrack): TrackRole {
    const nameLower = track.name.toLowerCase();

    // Check name patterns
    if (track.isMain) return "main_video";
    if (nameLower.includes("caption") || nameLower.includes("subtitle")) return "caption";
    if (nameLower.includes("title")) return "title";
    if (nameLower.includes("b-roll") || nameLower.includes("broll")) return "b_roll";
    if (nameLower.includes("overlay")) return "overlay";
    if (nameLower.includes("music") || nameLower.includes("bgm")) return "background_music";
    if (nameLower.includes("voice") || nameLower.includes("narrat")) return "voiceover";
    if (nameLower.includes("sfx") || nameLower.includes("effect")) return "sound_effect";

    // Infer from track type
    if (track.type === "text") return "caption";
    if (track.type === "audio") return "background_music";

    return "main_video";
  }

  /**
   * Extract a single element.
   */
  private extractElement(
    element: OpenCutElement,
    mediaMap: Map<string, MediaFileInfo>,
    options: {
      abstractText: boolean;
      extractCaptionStyles: boolean;
      canvasSize: { width: number; height: number };
      trackRole: TrackRole;
    }
  ): TemplateElement {
    if (element.type === "text") {
      return this.extractTextElement(element, options);
    }
    return this.extractMediaElement(element, mediaMap, options);
  }

  /**
   * Extract a text element.
   */
  private extractTextElement(
    element: OpenCutTextElement,
    options: {
      abstractText: boolean;
      extractCaptionStyles: boolean;
      canvasSize: { width: number; height: number };
      trackRole: TrackRole;
    }
  ): TemplateElement {
    // Extract and deduplicate style
    const style = this.extractTextStyle(element);

    // Get or create caption style if extracting
    let styleId: string | undefined;
    if (options.extractCaptionStyles && options.trackRole === "caption") {
      styleId = this.getOrCreateCaptionStyle(element, style, options.canvasSize);
    }

    // Determine content
    let content: TemplateContent;
    if (options.abstractText) {
      // Create placeholder for text content
      const placeholderId = this.createTextPlaceholder(element.name, element.content);
      content = { type: "placeholder", placeholderId };
    } else if (options.trackRole === "caption") {
      // For captions, use transcript content
      content = { type: "transcript", segmentType: "phrase" };
    } else {
      // Keep as static text
      content = { type: "static", value: element.content };
    }

    return {
      id: generateId(),
      name: element.name,
      timing: this.extractTiming(element),
      duration: this.extractDuration(element),
      content,
      style: styleId ? undefined : style, // Use style reference if available
      position: {
        xPercent: positionToPercent(element.x, options.canvasSize.width),
        yPercent: positionToPercent(element.y, options.canvasSize.height),
        rotation: element.rotation,
      },
      hidden: element.hidden,
    };
  }

  /**
   * Extract a media element.
   */
  private extractMediaElement(
    element: OpenCutMediaElement,
    mediaMap: Map<string, MediaFileInfo>,
    options: {
      trackRole: TrackRole;
      canvasSize: { width: number; height: number };
    }
  ): TemplateElement {
    // Get or create placeholder for this media
    const placeholderId = this.getOrCreateMediaPlaceholder(
      element.mediaId,
      element.name,
      mediaMap,
      options.trackRole
    );

    return {
      id: generateId(),
      name: element.name,
      timing: this.extractTiming(element),
      duration: this.extractDuration(element),
      content: { type: "placeholder", placeholderId },
      muted: element.muted,
      hidden: element.hidden,
    };
  }

  /**
   * Extract timing information.
   */
  private extractTiming(element: OpenCutElement): ElementTiming {
    return {
      type: "absolute",
      startTime: element.startTime,
    };
  }

  /**
   * Extract duration information.
   */
  private extractDuration(element: OpenCutElement): ElementDuration {
    const visibleDuration = element.duration - element.trimStart - element.trimEnd;
    return {
      type: "fixed",
      value: visibleDuration,
    };
  }

  /**
   * Extract text style from element.
   */
  private extractTextStyle(element: OpenCutTextElement): TextStyleDefinition {
    return {
      fontSize: element.fontSize,
      fontFamily: element.fontFamily,
      color: element.color,
      backgroundColor: element.backgroundColor,
      textAlign: element.textAlign,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textDecoration: element.textDecoration,
      opacity: element.opacity,
    };
  }

  /**
   * Get or create a caption style definition.
   */
  private getOrCreateCaptionStyle(
    element: OpenCutTextElement,
    style: TextStyleDefinition,
    canvasSize: { width: number; height: number }
  ): string {
    // Create hash for deduplication
    const hash = this.hashStyle(style);

    if (this.styleHashToId.has(hash)) {
      return this.styleHashToId.get(hash)!;
    }

    // Create new caption style
    const styleId = generateId();
    const captionStyle: CaptionStyleDefinition = {
      id: styleId,
      name: generateUniqueName(
        "Caption Style",
        this.captionStyles.map((s) => s.name)
      ),
      isDefault: this.captionStyles.length === 0,
      style,
      position: {
        xPercent: positionToPercent(element.x, canvasSize.width),
        yPercent: positionToPercent(element.y, canvasSize.height),
        rotation: element.rotation,
      },
      animation: "none" as CaptionAnimation,
      grouping: {
        type: "phrase",
        maxWords: 5,
        maxDuration: 3,
      },
    };

    this.captionStyles.push(captionStyle);
    this.styleHashToId.set(hash, styleId);

    return styleId;
  }

  /**
   * Create a hash of style properties for deduplication.
   */
  private hashStyle(style: TextStyleDefinition): string {
    return JSON.stringify({
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      color: style.color,
      backgroundColor: style.backgroundColor,
      textAlign: style.textAlign,
      fontWeight: style.fontWeight,
      opacity: style.opacity,
    });
  }

  /**
   * Get or create a placeholder for media.
   */
  private getOrCreateMediaPlaceholder(
    mediaId: string,
    elementName: string,
    mediaMap: Map<string, MediaFileInfo>,
    trackRole: TrackRole
  ): string {
    // Check if we already have a placeholder for this media
    if (this.mediaIdToPlaceholder.has(mediaId)) {
      return this.mediaIdToPlaceholder.get(mediaId)!;
    }

    const media = mediaMap.get(mediaId);
    const placeholderId = generateId();

    // Determine placeholder type
    let type: PlaceholderType = "video";
    if (media) {
      type = media.type;
    } else if (trackRole === "background_music" || trackRole === "voiceover") {
      type = "audio";
    }

    // Create placeholder
    const placeholder: PlaceholderDefinition = {
      id: placeholderId,
      name: generateUniqueName(
        this.generatePlaceholderName(trackRole, type),
        this.placeholders.map((p) => p.name)
      ),
      type,
      description: `${type} content for ${trackRole.replace(/_/g, " ")}`,
      required: trackRole === "main_video",
      constraints: this.generateConstraints(media, type),
      order: this.placeholders.length,
    };

    this.placeholders.push(placeholder);
    this.mediaIdToPlaceholder.set(mediaId, placeholderId);

    return placeholderId;
  }

  /**
   * Generate a human-readable placeholder name.
   */
  private generatePlaceholderName(role: TrackRole, type: PlaceholderType): string {
    switch (role) {
      case "main_video":
        return "Main Video";
      case "b_roll":
        return "B-Roll Footage";
      case "background_music":
        return "Background Music";
      case "voiceover":
        return "Voice Over";
      case "sound_effect":
        return "Sound Effect";
      default:
        return `${type.charAt(0).toUpperCase() + type.slice(1)} Content`;
    }
  }

  /**
   * Generate constraints based on original media.
   */
  private generateConstraints(
    media: MediaFileInfo | undefined,
    type: PlaceholderType
  ): PlaceholderDefinition["constraints"] {
    if (!media) return undefined;

    const constraints: PlaceholderDefinition["constraints"] = {};

    if (media.duration && type !== "image") {
      constraints.minDuration = Math.max(1, media.duration * 0.5);
    }

    if (media.width && media.height && type !== "audio") {
      const aspectRatio = media.width / media.height;
      constraints.aspectRatio = Math.round(aspectRatio * 100) / 100;
      constraints.aspectRatioTolerance = 0.1;
    }

    return Object.keys(constraints).length > 0 ? constraints : undefined;
  }

  /**
   * Create a text placeholder.
   */
  private createTextPlaceholder(name: string, defaultValue: string): string {
    const placeholderId = generateId();

    const placeholder: PlaceholderDefinition = {
      id: placeholderId,
      name: generateUniqueName(name, this.placeholders.map((p) => p.name)),
      type: "text",
      description: "Text content",
      required: false,
      defaultValue: { type: "text", value: defaultValue },
      order: this.placeholders.length,
    };

    this.placeholders.push(placeholder);
    return placeholderId;
  }
}

/**
 * Create a template extractor instance.
 */
export function createExtractor(): TemplateExtractor {
  return new TemplateExtractor();
}
