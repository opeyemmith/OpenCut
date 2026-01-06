/**
 * Core template types for the automation system.
 *
 * A template represents an abstracted project structure that can be
 * reapplied with different content to generate new OpenCut projects.
 */

import type { AutomationRule } from "./rules";
import type { PlaceholderDefinition } from "./placeholder";

/**
 * The main automation template structure.
 * This is the "compiled" format that can be saved, shared, and reapplied.
 */
export interface AutomationTemplate {
  /** Schema version for future migrations */
  version: "1.0";

  /** Unique identifier for this template */
  id: string;

  /** Human-readable template name */
  name: string;

  /** Optional description of what this template does */
  description: string;

  /** ISO timestamp of creation */
  createdAt: string;

  /** ISO timestamp of last update */
  updatedAt: string;

  /** Original project ID this was extracted from (if any) */
  sourceProjectId?: string;

  /** Canvas/output settings */
  canvas: CanvasSettings;

  /** Template track definitions */
  tracks: TemplateTrack[];

  /** Automation rules to apply */
  rules: AutomationRule[];

  /** Caption style definitions */
  captionStyles: CaptionStyleDefinition[];

  /** Placeholder definitions for dynamic content */
  placeholders: PlaceholderDefinition[];
}

/**
 * Canvas settings for the output video.
 */
export interface CanvasSettings {
  /** Output width in pixels */
  width: number;

  /** Output height in pixels */
  height: number;

  /** Background color (hex) */
  backgroundColor: string;

  /** Background type */
  backgroundType: "color" | "blur";

  /** Frames per second */
  fps: number;
}

/**
 * A track in the template.
 * Tracks contain elements but with abstracted/placeholder content.
 */
export interface TemplateTrack {
  /** Unique identifier within the template */
  id: string;

  /** Track name */
  name: string;

  /** Track type matching OpenCut's track types */
  type: "media" | "text" | "audio";

  /** Semantic role of this track */
  role: TrackRole;

  /** Elements on this track */
  elements: TemplateElement[];

  /** Whether track is muted by default */
  muted?: boolean;

  /** Whether this is the main track */
  isMain?: boolean;
}

/**
 * Semantic role for a track.
 * Used to understand the purpose of a track for automation.
 */
export type TrackRole =
  | "main_video"       // Primary video content
  | "b_roll"           // Supplementary footage
  | "caption"          // Captions/subtitles
  | "title"            // Title cards
  | "background_music" // Background audio
  | "voiceover"        // Voice narration
  | "sound_effect"     // Sound effects
  | "overlay";         // Graphics/overlays

/**
 * An element in a template track.
 * Unlike OpenCut elements, these reference placeholders instead of actual media.
 */
export interface TemplateElement {
  /** Unique identifier within the template */
  id: string;

  /** Element name */
  name: string;

  /** When this element should appear */
  timing: ElementTiming;

  /** How long this element should last */
  duration: ElementDuration;

  /** What content this element should display */
  content: TemplateContent;

  /** Visual style (for text elements) */
  style?: TextStyleDefinition;

  /** Position on canvas (percentage-based for responsiveness) */
  position?: ElementPosition;

  /** Whether element is hidden by default */
  hidden?: boolean;

  /** Whether audio is muted (for media elements) */
  muted?: boolean;
}

/**
 * Timing specification for an element.
 */
export type ElementTiming =
  | {
      type: "absolute";
      /** Fixed start time in seconds */
      startTime: number;
    }
  | {
      type: "relative";
      /** ID of element this is relative to */
      relativeTo: string;
      /** Offset in seconds (can be negative) */
      offset: number;
      /** Whether to align to start or end of reference */
      anchor?: "start" | "end";
    }
  | {
      type: "dynamic";
      /** Rule that determines timing */
      rule: string;
    };

/**
 * Duration specification for an element.
 */
export type ElementDuration =
  | {
      type: "fixed";
      /** Fixed duration in seconds */
      value: number;
    }
  | {
      type: "content";
      /** Duration determined by content (e.g., media length) */
    }
  | {
      type: "match_audio";
      /** Match duration to audio input */
    }
  | {
      type: "fill_gap";
      /** Fill until next element or end */
      maxDuration?: number;
    };

/**
 * Content specification for an element.
 */
export type TemplateContent =
  | {
      type: "placeholder";
      /** ID of the placeholder to fill */
      placeholderId: string;
    }
  | {
      type: "transcript";
      /** How to segment the transcript */
      segmentType: "word" | "phrase" | "sentence";
      /** Which segment index (if multiple) */
      segmentIndex?: number;
    }
  | {
      type: "static";
      /** Fixed text value */
      value: string;
    }
  | {
      type: "generated";
      /** Name of generator to use */
      generator: string;
      /** Options for the generator */
      options?: Record<string, unknown>;
    };

/**
 * Position of an element on the canvas.
 * Uses percentage-based positioning for responsiveness.
 */
export interface ElementPosition {
  /** X position relative to center (-50 to 50) */
  xPercent: number;

  /** Y position relative to center (-50 to 50) */
  yPercent: number;

  /** Rotation in degrees */
  rotation?: number;
}

/**
 * Text styling definition.
 */
export interface TextStyleDefinition {
  /** Font size in pixels */
  fontSize: number;

  /** Font family name */
  fontFamily: string;

  /** Text color (hex or rgba) */
  color: string;

  /** Background color (hex or rgba) */
  backgroundColor: string;

  /** Text alignment */
  textAlign: "left" | "center" | "right";

  /** Font weight */
  fontWeight?: "normal" | "bold";

  /** Font style */
  fontStyle?: "normal" | "italic";

  /** Text decoration */
  textDecoration?: "none" | "underline" | "line-through";

  /** Opacity (0-1) */
  opacity?: number;
}

/**
 * Caption style definition with animation settings.
 */
export interface CaptionStyleDefinition {
  /** Unique identifier for this style */
  id: string;

  /** Human-readable name */
  name: string;

  /** Whether this is the default style */
  isDefault?: boolean;

  /** Base text styling */
  style: TextStyleDefinition;

  /** Position on canvas */
  position: ElementPosition;

  /** Animation type */
  animation: CaptionAnimation;

  /** How to group words into captions */
  grouping: CaptionGrouping;
}

/**
 * Caption animation types.
 */
export type CaptionAnimation =
  | "none"
  | "fade"
  | "pop"
  | "typewriter"
  | "highlight"
  | "slide_up"
  | "slide_down";

/**
 * Caption grouping settings.
 */
export interface CaptionGrouping {
  /** How to group words */
  type: "word" | "phrase" | "sentence" | "fixed_words";

  /** Max words per caption (for fixed_words) */
  maxWords?: number;

  /** Max duration per caption in seconds */
  maxDuration?: number;
}

// Re-export related types
export type { AutomationRule } from "./rules";
export type { PlaceholderDefinition } from "./placeholder";
