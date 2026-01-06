/**
 * Utility functions for template operations.
 */

/**
 * Generate a UUID v4.
 * Platform-agnostic implementation.
 */
export function generateId(): string {
  // Use crypto.randomUUID if available (modern browsers, Node 19+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get current ISO timestamp.
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Deep clone an object.
 * Uses structuredClone if available, falls back to JSON.
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is a non-null object.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Merge objects deeply.
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Partial<T>>
): T {
  const result = deepClone(target);

  for (const source of sources) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (isObject(sourceValue) && isObject(targetValue)) {
          (result as Record<string, unknown>)[key] = deepMerge(
            targetValue as Record<string, unknown>,
            sourceValue as Record<string, unknown>
          );
        } else if (sourceValue !== undefined) {
          (result as Record<string, unknown>)[key] = sourceValue;
        }
      }
    }
  }

  return result;
}

/**
 * Convert canvas-relative position to percentage.
 * OpenCut uses position relative to canvas center.
 *
 * @param value - Position value from OpenCut
 * @param canvasSize - Canvas dimension (width or height)
 * @returns Percentage value (-50 to 50)
 */
export function positionToPercent(value: number, canvasSize: number): number {
  // OpenCut positions are relative to center
  // Convert to percentage of canvas
  return (value / canvasSize) * 100;
}

/**
 * Convert percentage position back to canvas-relative.
 *
 * @param percent - Percentage value (-50 to 50)
 * @param canvasSize - Canvas dimension (width or height)
 * @returns Position value for OpenCut
 */
export function percentToPosition(percent: number, canvasSize: number): number {
  return (percent / 100) * canvasSize;
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to specified decimal places.
 */
export function round(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format duration in seconds to human-readable string.
 *
 * @param seconds - Duration in seconds
 * @returns Formatted string like "1:30" or "1:30:45"
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Parse duration string to seconds.
 *
 * @param duration - String like "1:30" or "1:30:45"
 * @returns Duration in seconds
 */
export function parseDuration(duration: string): number {
  const parts = duration.split(":").map(Number);

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * Generate a unique name by appending a number if needed.
 *
 * @param baseName - Base name to use
 * @param existingNames - List of existing names to avoid
 * @returns Unique name
 */
export function generateUniqueName(
  baseName: string,
  existingNames: string[]
): string {
  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  let counter = 1;
  let newName = `${baseName} (${counter})`;

  while (existingNames.includes(newName)) {
    counter++;
    newName = `${baseName} (${counter})`;
  }

  return newName;
}

/**
 * Escape regex special characters in a string.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Create a keyword matcher function.
 */
export function createKeywordMatcher(
  keywords: string[],
  options: {
    matchType: "exact" | "contains" | "starts_with" | "ends_with" | "regex";
    caseSensitive?: boolean;
  }
): (text: string) => boolean {
  const { matchType, caseSensitive = false } = options;

  const processedKeywords = caseSensitive
    ? keywords
    : keywords.map((k) => k.toLowerCase());

  return (text: string) => {
    const processedText = caseSensitive ? text : text.toLowerCase();

    return processedKeywords.some((keyword) => {
      switch (matchType) {
        case "exact":
          return processedText === keyword;
        case "contains":
          return processedText.includes(keyword);
        case "starts_with":
          return processedText.startsWith(keyword);
        case "ends_with":
          return processedText.endsWith(keyword);
        case "regex":
          try {
            const regex = new RegExp(keyword, caseSensitive ? "" : "i");
            return regex.test(text);
          } catch {
            return false;
          }
        default:
          return false;
      }
    });
  };
}
