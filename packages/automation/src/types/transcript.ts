/**
 * Transcript types for caption generation.
 *
 * These types represent transcription output that can be used
 * to generate captions automatically.
 */

/**
 * Full transcript of audio/video content.
 */
export interface Transcript {
  /** Detected language code (e.g., "en", "es") */
  language: string;

  /** Total duration in seconds */
  duration: number;

  /** Full text content */
  text: string;

  /** Word-level timestamps */
  words: TranscriptWord[];

  /** Sentence/phrase segments */
  segments: TranscriptSegment[];

  /** Metadata about the transcription */
  metadata?: TranscriptMetadata;
}

/**
 * A single word with timing information.
 */
export interface TranscriptWord {
  /** The word text */
  word: string;

  /** Start time in seconds */
  start: number;

  /** End time in seconds */
  end: number;

  /** Confidence score (0-1) */
  confidence: number;

  /** Whether this is punctuation or a word */
  type?: "word" | "punctuation";
}

/**
 * A segment (sentence or phrase) of the transcript.
 */
export interface TranscriptSegment {
  /** Unique identifier */
  id: string;

  /** Full text of the segment */
  text: string;

  /** Start time in seconds */
  start: number;

  /** End time in seconds */
  end: number;

  /** Words in this segment */
  words: TranscriptWord[];

  /** Speaker identification (if available) */
  speaker?: string;
}

/**
 * Metadata about the transcription process.
 */
export interface TranscriptMetadata {
  /** Provider used (e.g., "whisper", "openai", "deepgram") */
  provider: string;

  /** Model version */
  modelVersion?: string;

  /** Processing time in seconds */
  processingTime?: number;

  /** Audio quality assessment */
  audioQuality?: "low" | "medium" | "high";

  /** Whether speaker diarization was performed */
  hasSpeakerDiarization?: boolean;
}

// ============================================================
// Transcription Input/Output Types
// ============================================================

/**
 * Input for transcription.
 */
export interface TranscriptionInput {
  /** Audio source */
  audio: AudioSource;

  /** Target language (for improved accuracy) */
  language?: string;

  /** Whether to include word-level timestamps */
  wordTimestamps?: boolean;

  /** Whether to perform speaker diarization */
  speakerDiarization?: boolean;

  /** Custom vocabulary (domain-specific terms) */
  customVocabulary?: string[];
}

/**
 * Audio source for transcription.
 */
export type AudioSource =
  | { type: "file"; file: File }
  | { type: "buffer"; buffer: ArrayBuffer; mimeType: string }
  | { type: "url"; url: string };

/**
 * Result of transcription.
 */
export interface TranscriptionResult {
  /** Whether transcription was successful */
  success: boolean;

  /** The transcript (if successful) */
  transcript?: Transcript;

  /** Error message (if failed) */
  error?: string;

  /** Detailed error information */
  errorDetails?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

// ============================================================
// Caption Generation Types
// ============================================================

/**
 * Options for generating captions from a transcript.
 */
export interface CaptionGenerationOptions {
  /** Caption style to use */
  styleId: string;

  /** How to group words into captions */
  grouping: CaptionGroupingOptions;

  /** Keywords to highlight */
  highlightKeywords?: KeywordHighlight[];

  /** Whether to filter profanity */
  filterProfanity?: boolean;

  /** Custom replacements */
  replacements?: Array<{ from: string; to: string }>;
}

/**
 * Options for caption word grouping.
 */
export interface CaptionGroupingOptions {
  /** Grouping strategy */
  strategy: "word" | "phrase" | "sentence" | "fixed_time" | "fixed_words";

  /** Max words per caption (for fixed_words) */
  maxWords?: number;

  /** Max duration per caption (for fixed_time) */
  maxDuration?: number;

  /** Minimum duration per caption */
  minDuration?: number;

  /** Gap between captions (seconds) */
  gapBetween?: number;
}

/**
 * Keyword highlight configuration.
 */
export interface KeywordHighlight {
  /** Keywords to highlight */
  keywords: string[];

  /** Match type */
  matchType: "exact" | "contains" | "regex";

  /** Case sensitive matching */
  caseSensitive?: boolean;

  /** Style to apply */
  styleId: string;

  /** Optional emoji to insert */
  emoji?: string;
}

/**
 * A generated caption ready to be placed on the timeline.
 */
export interface GeneratedCaption {
  /** Caption text */
  text: string;

  /** Start time in seconds */
  start: number;

  /** End time in seconds */
  end: number;

  /** Style ID to use */
  styleId: string;

  /** Individual word timing (for word-by-word animation) */
  words?: Array<{
    word: string;
    start: number;
    end: number;
    highlighted?: boolean;
    highlightStyleId?: string;
  }>;
}
