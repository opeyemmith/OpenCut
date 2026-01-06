/**
 * Template Interpreter
 *
 * The "compiler" that takes a template + inputs and generates
 * a new OpenCut project structure.
 *
 * Key principle: Template + Inputs → New Project
 * (Automation = Compiler, not Editor)
 */

import type {
  AutomationTemplate,
  TemplateTrack,
  TemplateElement,
  TemplateContent,
  ElementTiming,
  ElementDuration,
  TextStyleDefinition,
  CaptionStyleDefinition,
  ElementPosition,
} from "../types/template";
import type {
  AutomationInputs,
  PlaceholderInput,
  AutomationOptions,
} from "../types/placeholder";
import type { Transcript, GeneratedCaption } from "../types/transcript";
import type { FileAdapter, MediaInfo } from "../types/adapters";
import { generateId, getCurrentTimestamp, percentToPosition } from "../utils/template-utils";
import { validatePlaceholderInputs } from "./validator";

// ============================================================
// Output Types (OpenCut-compatible structures)
// ============================================================

/**
 * Generated project output.
 */
export interface GeneratedProject {
  /** Project metadata */
  project: GeneratedProjectMetadata;

  /** Timeline tracks */
  tracks: GeneratedTrack[];

  /** Media files to import */
  mediaFiles: GeneratedMediaFile[];

  /** Generation metadata */
  meta: GenerationMetadata;
}

/**
 * Generated project metadata.
 */
export interface GeneratedProjectMetadata {
  id: string;
  name: string;
  canvasSize: { width: number; height: number };
  backgroundColor: string;
  backgroundType: "color" | "blur";
  fps: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Generated timeline track.
 */
export interface GeneratedTrack {
  id: string;
  name: string;
  type: "media" | "text" | "audio";
  elements: GeneratedElement[];
  muted: boolean;
  isMain: boolean;
}

/**
 * Generated timeline element.
 */
export type GeneratedElement = GeneratedMediaElement | GeneratedTextElement;

/**
 * Generated media element.
 */
export interface GeneratedMediaElement {
  id: string;
  type: "media";
  name: string;
  mediaId: string;
  duration: number;
  startTime: number;
  trimStart: number;
  trimEnd: number;
  muted: boolean;
  hidden: boolean;
}

/**
 * Generated text element.
 */
export interface GeneratedTextElement {
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
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline" | "line-through";
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  hidden: boolean;
}

/**
 * Media file to import into the project.
 */
export interface GeneratedMediaFile {
  id: string;
  name: string;
  type: "video" | "audio" | "image";
  file: File;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Generation metadata.
 */
export interface GenerationMetadata {
  templateId: string;
  templateName: string;
  generatedAt: string;
  duration: number;
  trackCount: number;
  elementCount: number;
  warnings: string[];
}

// ============================================================
// Interpreter Configuration
// ============================================================

/**
 * Configuration for the interpreter.
 */
export interface InterpreterConfig {
  /** File adapter for media operations */
  fileAdapter?: FileAdapter;

  /** Default canvas size if template doesn't specify */
  defaultCanvasSize?: { width: number; height: number };

  /** Default FPS if template doesn't specify */
  defaultFps?: number;
}

// ============================================================
// Interpreter Context
// ============================================================

/**
 * Internal context during interpretation.
 */
interface InterpretationContext {
  template: AutomationTemplate;
  inputs: AutomationInputs;
  options: AutomationOptions;
  config: InterpreterConfig;

  // Resolved data
  placeholderMedia: Map<string, { file: File; info: MediaInfo }>;
  placeholderText: Map<string, string>;
  transcript?: Transcript;

  // Generated IDs
  mediaIdMap: Map<string, string>; // placeholderId -> generated mediaId
  elementTimings: Map<string, { start: number; end: number }>; // for relative timing

  // Warnings
  warnings: string[];
}

// ============================================================
// Template Interpreter Class
// ============================================================

/**
 * Interprets automation templates to generate OpenCut projects.
 */
export class TemplateInterpreter {
  private config: InterpreterConfig;

  constructor(config: InterpreterConfig = {}) {
    this.config = {
      defaultCanvasSize: { width: 1920, height: 1080 },
      defaultFps: 30,
      ...config,
    };
  }

  /**
   * Apply a template with inputs to generate a new project.
   *
   * @param template - The automation template
   * @param inputs - User-provided inputs
   * @returns Generated project structure
   */
  async apply(
    template: AutomationTemplate,
    inputs: AutomationInputs
  ): Promise<GeneratedProject> {
    // Validate inputs
    const validation = validatePlaceholderInputs(template, inputs);
    if (!validation.isValid) {
      const errorMessages = Array.from(validation.errors.entries())
        .flatMap(([id, errors]) => errors.map((e) => `${id}: ${e.message}`))
        .join("; ");
      throw new Error(`Invalid inputs: ${errorMessages}`);
    }

    // Create interpretation context
    const context: InterpretationContext = {
      template,
      inputs,
      options: inputs.options || {},
      config: this.config,
      placeholderMedia: new Map(),
      placeholderText: new Map(),
      mediaIdMap: new Map(),
      elementTimings: new Map(),
      warnings: Array.from(validation.warnings.values()).flat(),
    };

    // Resolve placeholders
    await this.resolvePlaceholders(context);

    // Generate project metadata
    const project = this.generateProjectMetadata(context);

    // Generate tracks and elements
    const { tracks, mediaFiles } = await this.generateTracks(context);

    // Calculate total duration
    const duration = this.calculateTotalDuration(tracks);

    // Build result
    return {
      project,
      tracks,
      mediaFiles,
      meta: {
        templateId: template.id,
        templateName: template.name,
        generatedAt: getCurrentTimestamp(),
        duration,
        trackCount: tracks.length,
        elementCount: tracks.reduce((sum, t) => sum + t.elements.length, 0),
        warnings: context.warnings,
      },
    };
  }

  /**
   * Resolve all placeholder inputs.
   */
  private async resolvePlaceholders(context: InterpretationContext): Promise<void> {
    const { template, inputs, config } = context;

    for (const placeholder of template.placeholders) {
      const input = inputs.placeholders.get(placeholder.id);

      if (!input) {
        if (placeholder.defaultValue) {
          // Use default value
          if (placeholder.defaultValue.type === "text") {
            context.placeholderText.set(placeholder.id, placeholder.defaultValue.value);
          }
        }
        continue;
      }

      if (input.type === "file") {
        let info: MediaInfo;

        if (config.fileAdapter) {
          // Use adapter to get media info
          info = await config.fileAdapter.getMediaInfo({
            type: "file",
            file: input.file,
          });
        } else {
          // Basic fallback
          info = {
            mimeType: input.file.type,
            size: input.file.size,
            duration: input.metadata?.duration,
            width: input.metadata?.width,
            height: input.metadata?.height,
          };
        }

        context.placeholderMedia.set(placeholder.id, {
          file: input.file,
          info,
        });
      } else if (input.type === "text") {
        context.placeholderText.set(placeholder.id, input.value);
      }
    }
  }

  /**
   * Generate project metadata.
   */
  private generateProjectMetadata(
    context: InterpretationContext
  ): GeneratedProjectMetadata {
    const { template, options, config } = context;

    const canvasSize = options.canvasSize || {
      width: template.canvas.width || config.defaultCanvasSize!.width,
      height: template.canvas.height || config.defaultCanvasSize!.height,
    };

    return {
      id: generateId(),
      name: options.outputProjectName || `Generated from ${template.name}`,
      canvasSize,
      backgroundColor: template.canvas.backgroundColor,
      backgroundType: template.canvas.backgroundType,
      fps: options.fps || template.canvas.fps || config.defaultFps!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Generate tracks and collect media files.
   */
  private async generateTracks(
    context: InterpretationContext
  ): Promise<{ tracks: GeneratedTrack[]; mediaFiles: GeneratedMediaFile[] }> {
    const tracks: GeneratedTrack[] = [];
    const mediaFiles: GeneratedMediaFile[] = [];
    const addedMediaIds = new Set<string>();

    for (const templateTrack of context.template.tracks) {
      const { track, trackMediaFiles } = await this.generateTrack(
        templateTrack,
        context
      );

      tracks.push(track);

      // Add unique media files
      for (const mediaFile of trackMediaFiles) {
        if (!addedMediaIds.has(mediaFile.id)) {
          mediaFiles.push(mediaFile);
          addedMediaIds.add(mediaFile.id);
        }
      }
    }

    return { tracks, mediaFiles };
  }

  /**
   * Generate a single track.
   */
  private async generateTrack(
    templateTrack: TemplateTrack,
    context: InterpretationContext
  ): Promise<{ track: GeneratedTrack; trackMediaFiles: GeneratedMediaFile[] }> {
    const elements: GeneratedElement[] = [];
    const trackMediaFiles: GeneratedMediaFile[] = [];

    for (const templateElement of templateTrack.elements) {
      const result = await this.generateElement(
        templateElement,
        templateTrack,
        context
      );

      if (result) {
        elements.push(result.element);
        if (result.mediaFile) {
          trackMediaFiles.push(result.mediaFile);
        }

        // Store timing for relative references
        const endTime =
          result.element.startTime +
          result.element.duration -
          result.element.trimStart -
          result.element.trimEnd;
        context.elementTimings.set(templateElement.id, {
          start: result.element.startTime,
          end: endTime,
        });
      }
    }

    return {
      track: {
        id: generateId(),
        name: templateTrack.name,
        type: templateTrack.type,
        elements,
        muted: templateTrack.muted || false,
        isMain: templateTrack.isMain || templateTrack.role === "main_video",
      },
      trackMediaFiles,
    };
  }

  /**
   * Generate a single element.
   */
  private async generateElement(
    templateElement: TemplateElement,
    templateTrack: TemplateTrack,
    context: InterpretationContext
  ): Promise<{
    element: GeneratedElement;
    mediaFile?: GeneratedMediaFile;
  } | null> {
    const content = templateElement.content;

    // Resolve content
    if (content.type === "placeholder") {
      return this.generatePlaceholderElement(
        templateElement,
        content.placeholderId,
        templateTrack,
        context
      );
    }

    if (content.type === "static") {
      return this.generateTextElement(
        templateElement,
        content.value,
        templateTrack,
        context
      );
    }

    if (content.type === "transcript") {
      // Transcript content requires Phase 2 transcription
      context.warnings.push(
        `Transcript content not yet supported for element ${templateElement.name}`
      );
      return null;
    }

    return null;
  }

  /**
   * Generate element from placeholder.
   */
  private generatePlaceholderElement(
    templateElement: TemplateElement,
    placeholderId: string,
    templateTrack: TemplateTrack,
    context: InterpretationContext
  ): { element: GeneratedElement; mediaFile?: GeneratedMediaFile } | null {
    // Check for media placeholder
    const mediaData = context.placeholderMedia.get(placeholderId);
    if (mediaData) {
      return this.generateMediaElement(
        templateElement,
        mediaData,
        placeholderId,
        context
      );
    }

    // Check for text placeholder
    const textValue = context.placeholderText.get(placeholderId);
    if (textValue !== undefined) {
      return this.generateTextElement(
        templateElement,
        textValue,
        templateTrack,
        context
      );
    }

    // Placeholder not filled
    context.warnings.push(
      `Placeholder ${placeholderId} not provided for element ${templateElement.name}`
    );
    return null;
  }

  /**
   * Generate media element.
   */
  private generateMediaElement(
    templateElement: TemplateElement,
    mediaData: { file: File; info: MediaInfo },
    placeholderId: string,
    context: InterpretationContext
  ): { element: GeneratedMediaElement; mediaFile: GeneratedMediaFile } {
    // Get or create media ID for this placeholder
    let mediaId = context.mediaIdMap.get(placeholderId);
    if (!mediaId) {
      mediaId = generateId();
      context.mediaIdMap.set(placeholderId, mediaId);
    }

    // Calculate timing
    const startTime = this.resolveStartTime(templateElement.timing, context);
    const duration = this.resolveDuration(
      templateElement.duration,
      mediaData.info.duration || 5
    );

    // Create media file entry
    const mediaFile: GeneratedMediaFile = {
      id: mediaId,
      name: mediaData.file.name,
      type: this.getMediaType(mediaData.info.mimeType),
      file: mediaData.file,
      duration: mediaData.info.duration,
      width: mediaData.info.width,
      height: mediaData.info.height,
    };

    // Create element
    const element: GeneratedMediaElement = {
      id: generateId(),
      type: "media",
      name: templateElement.name,
      mediaId,
      duration,
      startTime,
      trimStart: 0,
      trimEnd: 0,
      muted: templateElement.muted || false,
      hidden: templateElement.hidden || false,
    };

    return { element, mediaFile };
  }

  /**
   * Generate text element.
   */
  private generateTextElement(
    templateElement: TemplateElement,
    text: string,
    templateTrack: TemplateTrack,
    context: InterpretationContext
  ): { element: GeneratedTextElement } {
    const { template } = context;
    const canvasSize = {
      width: template.canvas.width,
      height: template.canvas.height,
    };

    // Get style
    const style = templateElement.style || this.getDefaultTextStyle(template);
    const position = templateElement.position || { xPercent: 0, yPercent: 30 };

    // Calculate timing
    const startTime = this.resolveStartTime(templateElement.timing, context);
    const duration = this.resolveDuration(templateElement.duration, 3);

    const element: GeneratedTextElement = {
      id: generateId(),
      type: "text",
      name: templateElement.name,
      content: text,
      duration,
      startTime,
      trimStart: 0,
      trimEnd: 0,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      color: style.color,
      backgroundColor: style.backgroundColor,
      textAlign: style.textAlign,
      fontWeight: style.fontWeight || "normal",
      fontStyle: style.fontStyle || "normal",
      textDecoration: style.textDecoration || "none",
      x: percentToPosition(position.xPercent, canvasSize.width),
      y: percentToPosition(position.yPercent, canvasSize.height),
      rotation: position.rotation || 0,
      opacity: style.opacity || 1,
      hidden: templateElement.hidden || false,
    };

    return { element };
  }

  /**
   * Resolve start time from timing specification.
   */
  private resolveStartTime(
    timing: ElementTiming,
    context: InterpretationContext
  ): number {
    if (timing.type === "absolute") {
      return timing.startTime;
    }

    if (timing.type === "relative") {
      const reference = context.elementTimings.get(timing.relativeTo);
      if (!reference) {
        context.warnings.push(
          `Relative timing reference ${timing.relativeTo} not found, using 0`
        );
        return Math.max(0, timing.offset);
      }

      const anchor = timing.anchor === "start" ? reference.start : reference.end;
      return Math.max(0, anchor + timing.offset);
    }

    // Dynamic timing requires rule engine (Phase 2+)
    context.warnings.push("Dynamic timing not yet supported, using 0");
    return 0;
  }

  /**
   * Resolve duration from duration specification.
   */
  private resolveDuration(duration: ElementDuration, contentDuration: number): number {
    if (duration.type === "fixed") {
      return duration.value;
    }

    if (duration.type === "content") {
      return contentDuration;
    }

    if (duration.type === "match_audio") {
      // TODO: Get audio duration from context
      return contentDuration;
    }

    if (duration.type === "fill_gap") {
      // TODO: Calculate gap from timeline
      return duration.maxDuration || contentDuration;
    }

    return contentDuration;
  }

  /**
   * Get default text style.
   */
  private getDefaultTextStyle(template: AutomationTemplate): TextStyleDefinition {
    const defaultCaptionStyle = template.captionStyles.find((s) => s.isDefault);
    if (defaultCaptionStyle) {
      return defaultCaptionStyle.style;
    }

    return {
      fontSize: 48,
      fontFamily: "Inter",
      color: "#FFFFFF",
      backgroundColor: "transparent",
      textAlign: "center",
      opacity: 1,
    };
  }

  /**
   * Get media type from MIME type.
   */
  private getMediaType(mimeType: string): "video" | "audio" | "image" {
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "image";
  }

  /**
   * Calculate total duration of generated tracks.
   */
  private calculateTotalDuration(tracks: GeneratedTrack[]): number {
    let maxEnd = 0;

    for (const track of tracks) {
      for (const element of track.elements) {
        const end =
          element.startTime +
          element.duration -
          element.trimStart -
          element.trimEnd;
        if (end > maxEnd) {
          maxEnd = end;
        }
      }
    }

    return maxEnd;
  }
}

/**
 * Create an interpreter instance.
 */
export function createInterpreter(
  config?: InterpreterConfig
): TemplateInterpreter {
  return new TemplateInterpreter(config);
}
