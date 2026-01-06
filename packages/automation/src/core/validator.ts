/**
 * Template Validator
 *
 * Validates templates and placeholder inputs before processing.
 * Uses Zod for schema validation.
 */

import type { AutomationTemplate } from "../types/template";
import type {
  PlaceholderDefinition,
  PlaceholderInput,
  AutomationInputs,
  PlaceholderValidationResult,
  PlaceholderValidationError,
  PlaceholderErrorCode,
  MediaMetadata,
} from "../types/placeholder";

// ============================================================
// Template Validation
// ============================================================

/**
 * Result of template validation.
 */
export interface TemplateValidationResult {
  isValid: boolean;
  errors: TemplateValidationError[];
  warnings: string[];
}

/**
 * A validation error for a template.
 */
export interface TemplateValidationError {
  path: string;
  message: string;
  code: string;
}

/**
 * Validate a template structure.
 */
export function validateTemplate(
  template: unknown
): TemplateValidationResult {
  const errors: TemplateValidationError[] = [];
  const warnings: string[] = [];

  // Type guard
  if (!isObject(template)) {
    return {
      isValid: false,
      errors: [{ path: "", message: "Template must be an object", code: "INVALID_TYPE" }],
      warnings: [],
    };
  }

  const t = template as Record<string, unknown>;

  // Required fields
  if (t.version !== "1.0") {
    errors.push({
      path: "version",
      message: "Template version must be '1.0'",
      code: "INVALID_VERSION",
    });
  }

  if (typeof t.id !== "string" || t.id.length === 0) {
    errors.push({
      path: "id",
      message: "Template must have a valid id",
      code: "MISSING_ID",
    });
  }

  if (typeof t.name !== "string" || t.name.length === 0) {
    errors.push({
      path: "name",
      message: "Template must have a name",
      code: "MISSING_NAME",
    });
  }

  // Validate canvas
  if (!isObject(t.canvas)) {
    errors.push({
      path: "canvas",
      message: "Template must have canvas settings",
      code: "MISSING_CANVAS",
    });
  } else {
    const canvas = t.canvas as Record<string, unknown>;
    if (typeof canvas.width !== "number" || canvas.width <= 0) {
      errors.push({
        path: "canvas.width",
        message: "Canvas width must be a positive number",
        code: "INVALID_CANVAS_WIDTH",
      });
    }
    if (typeof canvas.height !== "number" || canvas.height <= 0) {
      errors.push({
        path: "canvas.height",
        message: "Canvas height must be a positive number",
        code: "INVALID_CANVAS_HEIGHT",
      });
    }
  }

  // Validate tracks
  if (!Array.isArray(t.tracks)) {
    errors.push({
      path: "tracks",
      message: "Template must have a tracks array",
      code: "MISSING_TRACKS",
    });
  } else {
    for (let i = 0; i < t.tracks.length; i++) {
      const trackErrors = validateTrack(t.tracks[i], `tracks[${i}]`);
      errors.push(...trackErrors);
    }
  }

  // Validate placeholders
  if (!Array.isArray(t.placeholders)) {
    errors.push({
      path: "placeholders",
      message: "Template must have a placeholders array",
      code: "MISSING_PLACEHOLDERS",
    });
  } else {
    const placeholderIds = new Set<string>();
    for (let i = 0; i < t.placeholders.length; i++) {
      const p = t.placeholders[i];
      if (isObject(p) && typeof (p as Record<string, unknown>).id === "string") {
        if (placeholderIds.has((p as Record<string, unknown>).id as string)) {
          errors.push({
            path: `placeholders[${i}].id`,
            message: "Duplicate placeholder ID",
            code: "DUPLICATE_PLACEHOLDER_ID",
          });
        }
        placeholderIds.add((p as Record<string, unknown>).id as string);
      }
    }
  }

  // Warnings
  if (Array.isArray(t.tracks) && t.tracks.length === 0) {
    warnings.push("Template has no tracks");
  }

  if (Array.isArray(t.placeholders) && t.placeholders.length === 0) {
    warnings.push("Template has no placeholders - it may not be reusable");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single track.
 */
function validateTrack(
  track: unknown,
  path: string
): TemplateValidationError[] {
  const errors: TemplateValidationError[] = [];

  if (!isObject(track)) {
    errors.push({
      path,
      message: "Track must be an object",
      code: "INVALID_TRACK",
    });
    return errors;
  }

  const t = track as Record<string, unknown>;

  if (typeof t.id !== "string" || t.id.length === 0) {
    errors.push({
      path: `${path}.id`,
      message: "Track must have an id",
      code: "MISSING_TRACK_ID",
    });
  }

  const validTypes = ["media", "text", "audio"];
  if (!validTypes.includes(t.type as string)) {
    errors.push({
      path: `${path}.type`,
      message: `Track type must be one of: ${validTypes.join(", ")}`,
      code: "INVALID_TRACK_TYPE",
    });
  }

  if (!Array.isArray(t.elements)) {
    errors.push({
      path: `${path}.elements`,
      message: "Track must have an elements array",
      code: "MISSING_ELEMENTS",
    });
  }

  return errors;
}

// ============================================================
// Placeholder Input Validation
// ============================================================

/**
 * Validate placeholder inputs against template definitions.
 */
export function validatePlaceholderInputs(
  template: AutomationTemplate,
  inputs: AutomationInputs
): PlaceholderValidationResult {
  const errors = new Map<string, PlaceholderValidationError[]>();
  const warnings = new Map<string, string[]>();

  for (const placeholder of template.placeholders) {
    const input = inputs.placeholders.get(placeholder.id);
    const placeholderErrors: PlaceholderValidationError[] = [];
    const placeholderWarnings: string[] = [];

    // Check required
    if (placeholder.required && !input) {
      placeholderErrors.push({
        code: "REQUIRED",
        message: `${placeholder.name} is required`,
      });
      errors.set(placeholder.id, placeholderErrors);
      continue;
    }

    // Skip validation if not provided and not required
    if (!input) {
      continue;
    }

    // Validate input type matches placeholder type
    const typeErrors = validateInputType(placeholder, input);
    placeholderErrors.push(...typeErrors);

    // Validate constraints if applicable
    if (placeholder.constraints && placeholderErrors.length === 0) {
      const constraintResults = validateConstraints(
        placeholder,
        input,
        placeholder.constraints
      );
      placeholderErrors.push(...constraintResults.errors);
      placeholderWarnings.push(...constraintResults.warnings);
    }

    if (placeholderErrors.length > 0) {
      errors.set(placeholder.id, placeholderErrors);
    }
    if (placeholderWarnings.length > 0) {
      warnings.set(placeholder.id, placeholderWarnings);
    }
  }

  return {
    isValid: errors.size === 0,
    errors,
    warnings,
  };
}

/**
 * Validate that input type matches placeholder type.
 */
function validateInputType(
  placeholder: PlaceholderDefinition,
  input: PlaceholderInput
): PlaceholderValidationError[] {
  const errors: PlaceholderValidationError[] = [];

  const compatibleTypes: Record<string, string[]> = {
    video: ["file", "url", "buffer"],
    audio: ["file", "url", "buffer"],
    image: ["file", "url", "buffer"],
    text: ["text"],
    number: ["number"],
    color: ["color", "text"],
    font: ["text"],
    transcript: ["file", "url", "buffer"],
  };

  const allowed = compatibleTypes[placeholder.type] || [];

  if (!allowed.includes(input.type)) {
    errors.push({
      code: "INVALID_TYPE",
      message: `Expected ${placeholder.type}, got ${input.type}`,
    });
  }

  return errors;
}

/**
 * Validate input against constraints.
 */
function validateConstraints(
  placeholder: PlaceholderDefinition,
  input: PlaceholderInput,
  constraints: NonNullable<PlaceholderDefinition["constraints"]>
): { errors: PlaceholderValidationError[]; warnings: string[] } {
  const errors: PlaceholderValidationError[] = [];
  const warnings: string[] = [];

  // For file inputs, check file-related constraints
  if (input.type === "file") {
    const file = input.file;

    // File size
    if (constraints.maxFileSize && file.size > constraints.maxFileSize) {
      errors.push({
        code: "FILE_TOO_LARGE",
        message: `File size ${formatBytes(file.size)} exceeds maximum ${formatBytes(constraints.maxFileSize)}`,
        details: { actualSize: file.size, maxSize: constraints.maxFileSize },
      });
    }

    // Format
    if (constraints.acceptedFormats) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!constraints.acceptedFormats.includes(extension)) {
        errors.push({
          code: "INVALID_FORMAT",
          message: `File format .${extension} not accepted. Accepted: ${constraints.acceptedFormats.join(", ")}`,
          details: { actualFormat: extension, acceptedFormats: constraints.acceptedFormats },
        });
      }
    }

    // Duration and resolution require metadata
    if (input.metadata) {
      const metadataErrors = validateMediaMetadata(constraints, input.metadata);
      errors.push(...metadataErrors);
    } else if (
      constraints.minDuration ||
      constraints.maxDuration ||
      constraints.aspectRatio ||
      constraints.minWidth ||
      constraints.minHeight
    ) {
      warnings.push(
        "Media metadata not provided - duration and resolution constraints not validated"
      );
    }
  }

  // For text inputs
  if (input.type === "text") {
    if (constraints.minLength && input.value.length < constraints.minLength) {
      errors.push({
        code: "TEXT_TOO_SHORT",
        message: `Text must be at least ${constraints.minLength} characters`,
      });
    }
    if (constraints.maxLength && input.value.length > constraints.maxLength) {
      errors.push({
        code: "TEXT_TOO_LONG",
        message: `Text must be at most ${constraints.maxLength} characters`,
      });
    }
    if (constraints.pattern) {
      const regex = new RegExp(constraints.pattern);
      if (!regex.test(input.value)) {
        errors.push({
          code: "PATTERN_MISMATCH",
          message: "Text does not match required pattern",
        });
      }
    }
  }

  // For number inputs
  if (input.type === "number") {
    if (constraints.minValue !== undefined && input.value < constraints.minValue) {
      errors.push({
        code: "VALUE_TOO_LOW",
        message: `Value must be at least ${constraints.minValue}`,
      });
    }
    if (constraints.maxValue !== undefined && input.value > constraints.maxValue) {
      errors.push({
        code: "VALUE_TOO_HIGH",
        message: `Value must be at most ${constraints.maxValue}`,
      });
    }
  }

  return { errors, warnings };
}

/**
 * Validate media metadata against constraints.
 */
function validateMediaMetadata(
  constraints: NonNullable<PlaceholderDefinition["constraints"]>,
  metadata: MediaMetadata
): PlaceholderValidationError[] {
  const errors: PlaceholderValidationError[] = [];

  // Duration
  if (metadata.duration !== undefined) {
    if (constraints.minDuration && metadata.duration < constraints.minDuration) {
      errors.push({
        code: "DURATION_TOO_SHORT",
        message: `Duration ${metadata.duration.toFixed(1)}s is shorter than minimum ${constraints.minDuration}s`,
      });
    }
    if (constraints.maxDuration && metadata.duration > constraints.maxDuration) {
      errors.push({
        code: "DURATION_TOO_LONG",
        message: `Duration ${metadata.duration.toFixed(1)}s is longer than maximum ${constraints.maxDuration}s`,
      });
    }
  }

  // Resolution
  if (metadata.width !== undefined && metadata.height !== undefined) {
    if (constraints.minWidth && metadata.width < constraints.minWidth) {
      errors.push({
        code: "RESOLUTION_TOO_LOW",
        message: `Width ${metadata.width}px is below minimum ${constraints.minWidth}px`,
      });
    }
    if (constraints.minHeight && metadata.height < constraints.minHeight) {
      errors.push({
        code: "RESOLUTION_TOO_LOW",
        message: `Height ${metadata.height}px is below minimum ${constraints.minHeight}px`,
      });
    }

    // Aspect ratio
    if (constraints.aspectRatio) {
      const actualRatio = metadata.width / metadata.height;
      const tolerance = constraints.aspectRatioTolerance || 0.1;
      const diff = Math.abs(actualRatio - constraints.aspectRatio);

      if (diff > tolerance) {
        errors.push({
          code: "WRONG_ASPECT_RATIO",
          message: `Aspect ratio ${actualRatio.toFixed(2)} differs from expected ${constraints.aspectRatio.toFixed(2)}`,
        });
      }
    }
  }

  return errors;
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Check if value is a non-null object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Format bytes to human-readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Check if a template is valid.
 */
export function isValidTemplate(template: unknown): template is AutomationTemplate {
  const result = validateTemplate(template);
  return result.isValid;
}
