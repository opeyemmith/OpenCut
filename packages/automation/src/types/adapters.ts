/**
 * Adapter interfaces for platform-specific implementations.
 *
 * These interfaces define contracts that each platform (web, desktop, mobile)
 * must implement to provide storage, transcription, and file access.
 *
 * The core automation logic uses these interfaces through dependency injection,
 * making it platform-agnostic.
 */

import type {
  AutomationTemplate,
  CaptionStyleDefinition,
} from "./template";
import type {
  Transcript,
  TranscriptionInput,
  TranscriptionResult,
} from "./transcript";

// ============================================================
// Storage Adapter
// ============================================================

/**
 * Interface for template storage operations.
 * Each platform implements this for their storage mechanism.
 *
 * @example Web: IndexedDB
 * @example Desktop: SQLite or file system
 * @example Mobile: SQLite or AsyncStorage
 */
export interface StorageAdapter {
  /**
   * Save a template to storage.
   */
  saveTemplate(template: AutomationTemplate): Promise<void>;

  /**
   * Load a template by ID.
   * Returns null if not found.
   */
  loadTemplate(id: string): Promise<AutomationTemplate | null>;

  /**
   * List all templates (summary only for performance).
   */
  listTemplates(): Promise<TemplateSummary[]>;

  /**
   * Delete a template by ID.
   */
  deleteTemplate(id: string): Promise<void>;

  /**
   * Search templates by name or description.
   */
  searchTemplates(query: string): Promise<TemplateSummary[]>;

  /**
   * Update an existing template.
   */
  updateTemplate(
    id: string,
    updates: Partial<AutomationTemplate>
  ): Promise<void>;

  /**
   * Duplicate a template with a new ID.
   */
  duplicateTemplate(
    id: string,
    newName: string
  ): Promise<AutomationTemplate>;

  /**
   * Export a template as JSON string.
   */
  exportTemplate(id: string): Promise<string>;

  /**
   * Import a template from JSON string.
   */
  importTemplate(json: string): Promise<AutomationTemplate>;
}

/**
 * Summary of a template for listing purposes.
 * Lighter than full AutomationTemplate.
 */
export interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  placeholderCount: number;
  trackCount: number;
  ruleCount: number;
  sourceProjectId?: string;
}

// ============================================================
// Transcription Adapter
// ============================================================

/**
 * Interface for transcription services.
 * Each platform can use different transcription backends.
 *
 * @example Web: WebAssembly Whisper or API call
 * @example Desktop: Native Whisper binary
 * @example Mobile: On-device ML or API call
 */
export interface TranscriptionAdapter {
  /**
   * Transcribe audio to text with timestamps.
   */
  transcribe(input: TranscriptionInput): Promise<TranscriptionResult>;

  /**
   * Check if transcription is available on this platform.
   */
  isAvailable(): Promise<boolean>;

  /**
   * Get list of supported languages.
   */
  getSupportedLanguages(): Promise<LanguageInfo[]>;

  /**
   * Get the name/identifier of this transcription provider.
   */
  getProviderName(): string;

  /**
   * Estimate transcription time for given audio duration.
   * Returns estimated time in seconds.
   */
  estimateTime?(audioDurationSeconds: number): number;
}

/**
 * Information about a supported language.
 */
export interface LanguageInfo {
  /** Language code (e.g., "en", "es") */
  code: string;

  /** Display name (e.g., "English", "Spanish") */
  name: string;

  /** Whether this language is well-supported */
  quality?: "high" | "medium" | "low";
}

// ============================================================
// File Adapter
// ============================================================

/**
 * Interface for file system operations.
 * Abstracts file I/O across platforms.
 *
 * @example Web: File API, OPFS
 * @example Desktop: Native file system
 * @example Mobile: Native file system
 */
export interface FileAdapter {
  /**
   * Read a file as binary data.
   */
  readFile(path: string): Promise<Uint8Array>;

  /**
   * Write binary data to a file.
   */
  writeFile(path: string, data: Uint8Array): Promise<void>;

  /**
   * Get media file metadata (duration, dimensions, etc.).
   */
  getMediaInfo(file: MediaInput): Promise<MediaInfo>;

  /**
   * Generate a thumbnail from a video file.
   */
  generateThumbnail?(
    file: MediaInput,
    timeSeconds: number
  ): Promise<Uint8Array>;

  /**
   * Extract audio from a video file.
   */
  extractAudio?(file: MediaInput): Promise<Uint8Array>;
}

/**
 * Input for media file operations.
 */
export type MediaInput =
  | { type: "file"; file: File }
  | { type: "path"; path: string }
  | { type: "buffer"; buffer: Uint8Array; mimeType: string };

/**
 * Information about a media file.
 */
export interface MediaInfo {
  /** Duration in seconds (for audio/video) */
  duration?: number;

  /** Width in pixels (for image/video) */
  width?: number;

  /** Height in pixels (for image/video) */
  height?: number;

  /** Frames per second (for video) */
  fps?: number;

  /** MIME type */
  mimeType: string;

  /** File size in bytes */
  size: number;

  /** Whether file has audio track */
  hasAudio?: boolean;

  /** Whether file has video track */
  hasVideo?: boolean;
}

// ============================================================
// Analytics Adapter (Optional)
// ============================================================

/**
 * Optional interface for analytics/logging.
 * Useful for understanding usage patterns.
 */
export interface AnalyticsAdapter {
  /**
   * Track a template creation event.
   */
  trackTemplateCreated(templateId: string, metadata?: Record<string, unknown>): void;

  /**
   * Track a template application event.
   */
  trackTemplateApplied(templateId: string, metadata?: Record<string, unknown>): void;

  /**
   * Track an error.
   */
  trackError(error: Error, context?: Record<string, unknown>): void;
}

// ============================================================
// Combined Adapters Interface
// ============================================================

/**
 * All adapters required by the automation engine.
 */
export interface AutomationAdapters {
  /** Template storage */
  storage: StorageAdapter;

  /** File operations */
  file: FileAdapter;

  /** Transcription (optional, Phase 2+) */
  transcription?: TranscriptionAdapter;

  /** Analytics (optional) */
  analytics?: AnalyticsAdapter;
}

/**
 * Configuration for creating an automation instance.
 */
export interface AutomationConfig {
  /** Platform adapters */
  adapters: AutomationAdapters;

  /** Feature flags */
  featureFlags?: Partial<import("../feature-flags").AutomationFeatureFlags>;

  /** Default caption styles */
  defaultCaptionStyles?: CaptionStyleDefinition[];
}
