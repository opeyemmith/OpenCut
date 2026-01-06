/**
 * Placeholder types for template dynamic content.
 *
 * Placeholders are "slots" in a template that get filled with
 * user-provided content when applying the template.
 */

/**
 * Definition of a placeholder in a template.
 */
export interface PlaceholderDefinition {
  /** Unique identifier for this placeholder */
  id: string;

  /** Human-readable name */
  name: string;

  /** Type of content expected */
  type: PlaceholderType;

  /** Description of what content is expected */
  description: string;

  /** Whether this placeholder must be filled */
  required: boolean;

  /** Constraints on the content */
  constraints?: PlaceholderConstraints;

  /** Default value if not provided */
  defaultValue?: PlaceholderDefaultValue;

  /** Display order in UI */
  order?: number;
}

/**
 * Types of placeholder content.
 */
export type PlaceholderType =
  | "video"      // Video file
  | "audio"      // Audio file
  | "image"      // Image file
  | "text"       // Text string
  | "transcript" // Audio/video for transcription
  | "number"     // Numeric value
  | "color"      // Color value
  | "font";      // Font selection

/**
 * Constraints for placeholder content.
 */
export interface PlaceholderConstraints {
  /** Minimum duration in seconds (for media) */
  minDuration?: number;

  /** Maximum duration in seconds (for media) */
  maxDuration?: number;

  /** Required aspect ratio (width/height) */
  aspectRatio?: number;

  /** Aspect ratio tolerance (e.g., 0.1 for 10% variance) */
  aspectRatioTolerance?: number;

  /** Accepted file formats (e.g., ["mp4", "webm"]) */
  acceptedFormats?: string[];

  /** Minimum resolution (for images/video) */
  minWidth?: number;
  minHeight?: number;

  /** Maximum file size in bytes */
  maxFileSize?: number;

  /** Minimum text length (for text) */
  minLength?: number;

  /** Maximum text length (for text) */
  maxLength?: number;

  /** Regex pattern for validation (for text) */
  pattern?: string;

  /** Minimum value (for numbers) */
  minValue?: number;

  /** Maximum value (for numbers) */
  maxValue?: number;
}

/**
 * Default values for placeholders.
 */
export type PlaceholderDefaultValue =
  | { type: "text"; value: string }
  | { type: "number"; value: number }
  | { type: "color"; value: string }
  | { type: "font"; value: string };

// ============================================================
// User Input Types (when applying a template)
// ============================================================

/**
 * User-provided inputs when applying a template.
 */
export interface AutomationInputs {
  /** Map of placeholder ID to input value */
  placeholders: Map<string, PlaceholderInput>;

  /** Optional configuration overrides */
  options?: AutomationOptions;
}

/**
 * Input value for a placeholder.
 */
export type PlaceholderInput =
  | {
      type: "file";
      /** The file to use */
      file: File;
      /** Optional metadata */
      metadata?: MediaMetadata;
    }
  | {
      type: "text";
      /** Text value */
      value: string;
    }
  | {
      type: "url";
      /** URL to fetch content from */
      url: string;
    }
  | {
      type: "number";
      /** Numeric value */
      value: number;
    }
  | {
      type: "color";
      /** Color value (hex) */
      value: string;
    }
  | {
      type: "buffer";
      /** Raw binary data */
      buffer: ArrayBuffer;
      /** MIME type */
      mimeType: string;
      /** Original filename */
      filename: string;
    };

/**
 * Metadata for media inputs.
 */
export interface MediaMetadata {
  /** Duration in seconds */
  duration?: number;

  /** Width in pixels */
  width?: number;

  /** Height in pixels */
  height?: number;

  /** Frames per second */
  fps?: number;
}

/**
 * Options for automation execution.
 */
export interface AutomationOptions {
  /** Whether to generate captions from transcript */
  generateCaptions?: boolean;

  /** Language for transcription */
  transcriptionLanguage?: string;

  /** Whether to apply automation rules */
  applyRules?: boolean;

  /** Specific rules to apply (if not all) */
  enabledRuleIds?: string[];

  /** Output project name */
  outputProjectName?: string;

  /** Canvas size override */
  canvasSize?: { width: number; height: number };

  /** FPS override */
  fps?: number;
}

// ============================================================
// Validation Types
// ============================================================

/**
 * Result of validating placeholder inputs.
 */
export interface PlaceholderValidationResult {
  /** Whether all inputs are valid */
  isValid: boolean;

  /** Errors by placeholder ID */
  errors: Map<string, PlaceholderValidationError[]>;

  /** Warnings (non-blocking) by placeholder ID */
  warnings: Map<string, string[]>;
}

/**
 * A validation error for a placeholder.
 */
export interface PlaceholderValidationError {
  /** Error code for programmatic handling */
  code: PlaceholderErrorCode;

  /** Human-readable message */
  message: string;

  /** Additional context */
  details?: Record<string, unknown>;
}

/**
 * Error codes for placeholder validation.
 */
export type PlaceholderErrorCode =
  | "REQUIRED"           // Required placeholder not provided
  | "INVALID_TYPE"       // Wrong content type
  | "DURATION_TOO_SHORT" // Below minimum duration
  | "DURATION_TOO_LONG"  // Above maximum duration
  | "WRONG_ASPECT_RATIO" // Aspect ratio mismatch
  | "INVALID_FORMAT"     // Unsupported file format
  | "FILE_TOO_LARGE"     // Exceeds max file size
  | "RESOLUTION_TOO_LOW" // Below minimum resolution
  | "TEXT_TOO_SHORT"     // Below minimum length
  | "TEXT_TOO_LONG"      // Above maximum length
  | "PATTERN_MISMATCH"   // Doesn't match regex pattern
  | "VALUE_TOO_LOW"      // Below minimum value
  | "VALUE_TOO_HIGH";    // Above maximum value
