/**
 * Platform Adapter Interfaces
 *
 * These interfaces define the contracts for platform-specific implementations.
 * Each platform (web, desktop, mobile) provides its own adapters.
 */

// ============================================
// Storage Adapter
// ============================================

/**
 * Abstract storage interface for persisting data.
 * Implementations:
 * - Web: IndexedDB
 * - Desktop (Tauri): SQLite
 * - Mobile (React Native): SQLite
 */
export interface StorageAdapter {
  /**
   * Get a value by key
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set a value by key
   */
  set<T>(key: string, value: T): Promise<void>;

  /**
   * Delete a value by key
   */
  delete(key: string): Promise<void>;

  /**
   * List all keys matching a prefix
   */
  list(prefix?: string): Promise<string[]>;

  /**
   * Check if a key exists
   */
  has(key: string): Promise<boolean>;

  /**
   * Clear all data (use with caution)
   */
  clear(): Promise<void>;
}

// ============================================
// File Adapter
// ============================================

/**
 * Abstract file system interface for media handling.
 * Implementations:
 * - Web: OPFS (Origin Private File System)
 * - Desktop: Native file system via Tauri
 * - Mobile: Native file system via React Native
 */
export interface FileAdapter {
  /**
   * Read a file as ArrayBuffer
   */
  read(path: string): Promise<ArrayBuffer>;

  /**
   * Read a file as text
   */
  readText(path: string): Promise<string>;

  /**
   * Write data to a file
   */
  write(path: string, data: ArrayBuffer | string): Promise<void>;

  /**
   * Delete a file
   */
  delete(path: string): Promise<void>;

  /**
   * Check if a file exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * List files in a directory
   */
  listDir(path: string): Promise<FileInfo[]>;

  /**
   * Create a directory (and parents if needed)
   */
  mkdir(path: string): Promise<void>;

  /**
   * Copy a file
   */
  copy(from: string, to: string): Promise<void>;

  /**
   * Get file info
   */
  stat(path: string): Promise<FileInfo>;
}

export interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: Date;
}

// ============================================
// Transcription Adapter
// ============================================

/**
 * Abstract transcription interface for speech-to-text.
 * Implementations:
 * - Web: Web Speech API or cloud service
 * - Desktop: Local Whisper or cloud
 * - Mobile: Cloud service
 */
export interface TranscriptionAdapter {
  /**
   * Transcribe audio file to text with timestamps
   */
  transcribe(audioPath: string, options?: TranscriptionOptions): Promise<Transcript>;

  /**
   * Check if transcription is available
   */
  isAvailable(): Promise<boolean>;
}

export interface TranscriptionOptions {
  language?: string;
  wordTimestamps?: boolean;
}

export interface Transcript {
  text: string;
  segments: TranscriptSegment[];
  language: string;
  duration: number;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words?: TranscriptWord[];
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

// ============================================
// Platform Context
// ============================================

/**
 * Container for all platform adapters.
 * Injected into core logic at runtime.
 */
export interface PlatformContext {
  storage: StorageAdapter;
  files: FileAdapter;
  transcription: TranscriptionAdapter;
  platform: "web" | "desktop" | "mobile";
}
