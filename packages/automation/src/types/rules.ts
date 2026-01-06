/**
 * Automation rule types.
 *
 * Rules define automatic transformations that are applied when
 * generating a project from a template.
 */

/**
 * An automation rule that triggers actions based on conditions.
 */
export interface AutomationRule {
  /** Unique identifier for this rule */
  id: string;

  /** Human-readable name */
  name: string;

  /** Description of what this rule does */
  description?: string;

  /** When this rule should trigger */
  trigger: RuleTrigger;

  /** Actions to perform when triggered */
  actions: RuleAction[];

  /** Whether the rule is enabled */
  enabled: boolean;

  /** Priority (higher = executed first) */
  priority: number;

  /** Category for organization */
  category?: RuleCategory;
}

/**
 * Rule categories for organization.
 */
export type RuleCategory =
  | "audio"     // Audio-related rules
  | "caption"   // Caption/text rules
  | "editing"   // Editing rules (cuts, trims)
  | "effects"   // Visual effects
  | "timing";   // Timing adjustments

// ============================================================
// Rule Triggers
// ============================================================

/**
 * Conditions that trigger a rule.
 */
export type RuleTrigger =
  // === MVP Triggers ===
  | SilenceTrigger
  | KeywordTrigger
  | ManualTrigger

  // === Phase 2+ Triggers (feature-flagged) ===
  | SceneChangeTrigger
  | AudioPeakTrigger
  | TimestampTrigger
  | DurationTrigger;

/**
 * Trigger on silence in audio.
 * MVP feature.
 */
export interface SilenceTrigger {
  type: "silence";
  /** Minimum silence duration to trigger (seconds) */
  minDuration: number;
  /** Volume threshold (0-1, below this is silence) */
  threshold?: number;
}

/**
 * Trigger on specific keywords in transcript.
 * MVP feature.
 */
export interface KeywordTrigger {
  type: "keyword";
  /** Keywords to match */
  keywords: string[];
  /** Match type */
  matchType: "exact" | "contains" | "starts_with" | "ends_with" | "regex";
  /** Case sensitivity */
  caseSensitive?: boolean;
}

/**
 * Manual trigger (user-initiated).
 * MVP feature.
 */
export interface ManualTrigger {
  type: "manual";
  /** Description for the user */
  description?: string;
}

/**
 * Trigger on scene changes.
 * Phase 2+ feature.
 */
export interface SceneChangeTrigger {
  type: "scene_change";
  /** Sensitivity (0-1, higher = more sensitive) */
  sensitivity?: number;
}

/**
 * Trigger on audio peaks.
 * Phase 2+ feature.
 */
export interface AudioPeakTrigger {
  type: "audio_peak";
  /** Volume threshold (0-1) */
  threshold: number;
  /** Minimum duration of peak (seconds) */
  minDuration?: number;
}

/**
 * Trigger at specific timestamps.
 * Phase 2+ feature.
 */
export interface TimestampTrigger {
  type: "timestamp";
  /** Timestamps to trigger at (seconds) */
  timestamps: number[];
}

/**
 * Trigger based on element duration.
 * Phase 2+ feature.
 */
export interface DurationTrigger {
  type: "duration";
  /** Condition to check */
  condition: "longer_than" | "shorter_than" | "between";
  /** Duration value(s) in seconds */
  value: number;
  /** Second value for "between" condition */
  value2?: number;
}

// ============================================================
// Rule Actions
// ============================================================

/**
 * Actions that can be performed by rules.
 */
export type RuleAction =
  // === MVP Actions ===
  | CutAction
  | HighlightTextAction
  | InsertPauseAction
  | ChangeStyleAction

  // === Phase 2+ Actions (feature-flagged) ===
  | ZoomAction
  | AddEffectAction
  | SpeedChangeAction
  | InsertElementAction;

/**
 * Cut/remove a segment.
 * MVP feature.
 */
export interface CutAction {
  type: "cut";
  /** Whether to ripple (shift following content) */
  ripple?: boolean;
}

/**
 * Highlight text with a different style.
 * MVP feature.
 */
export interface HighlightTextAction {
  type: "highlight_text";
  /** ID of caption style to apply */
  styleId: string;
  /** Duration of highlight (seconds, or "word" for word duration) */
  duration?: number | "word";
}

/**
 * Insert a pause/freeze.
 * MVP feature.
 */
export interface InsertPauseAction {
  type: "insert_pause";
  /** Pause duration in seconds */
  duration: number;
}

/**
 * Change element style.
 * MVP feature.
 */
export interface ChangeStyleAction {
  type: "change_style";
  /** Style properties to change */
  properties: Partial<{
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: "normal" | "bold";
    opacity: number;
  }>;
}

/**
 * Zoom in/out effect.
 * Phase 2+ feature.
 */
export interface ZoomAction {
  type: "zoom";
  /** Zoom factor (1 = no zoom, 2 = 2x zoom) */
  factor: number;
  /** Zoom duration (seconds) */
  duration: number;
  /** Easing function */
  easing?: "linear" | "ease_in" | "ease_out" | "ease_in_out";
  /** Zoom center point */
  center?: { xPercent: number; yPercent: number };
}

/**
 * Add a visual effect.
 * Phase 2+ feature.
 */
export interface AddEffectAction {
  type: "add_effect";
  /** Effect name */
  effect: string;
  /** Effect parameters */
  parameters?: Record<string, unknown>;
  /** Effect duration (seconds) */
  duration?: number;
}

/**
 * Change playback speed.
 * Phase 2+ feature.
 */
export interface SpeedChangeAction {
  type: "speed_change";
  /** Speed multiplier (0.5 = half speed, 2 = double speed) */
  speed: number;
  /** Duration to apply speed change (seconds) */
  duration?: number;
}

/**
 * Insert a new element.
 * Phase 2+ feature.
 */
export interface InsertElementAction {
  type: "insert_element";
  /** Element to insert (partial TemplateElement) */
  element: {
    type: "text" | "media";
    content: string | { placeholderId: string };
    duration?: number;
    style?: Record<string, unknown>;
  };
  /** Where to insert relative to trigger point */
  position: "before" | "after" | "overlay";
}

// ============================================================
// Rule Execution Types
// ============================================================

/**
 * Context provided when executing rules.
 */
export interface RuleExecutionContext {
  /** Current timestamp in the timeline */
  currentTime: number;

  /** Transcript data (if available) */
  transcript?: {
    words: Array<{
      word: string;
      start: number;
      end: number;
    }>;
  };

  /** Audio analysis data (if available) */
  audioAnalysis?: {
    silenceRegions: Array<{ start: number; end: number }>;
    peakRegions: Array<{ start: number; end: number; level: number }>;
  };

  /** Scene detection data (if available) */
  sceneChanges?: number[];
}

/**
 * Result of rule execution.
 */
export interface RuleExecutionResult {
  /** Whether execution was successful */
  success: boolean;

  /** Changes to apply to the timeline */
  changes: TimelineChange[];

  /** Log messages */
  logs: string[];

  /** Errors encountered */
  errors: string[];
}

/**
 * A change to apply to the timeline.
 */
export interface TimelineChange {
  type: "insert" | "delete" | "modify";
  /** Target track ID */
  trackId?: string;
  /** Target element ID (for modify/delete) */
  elementId?: string;
  /** Time position */
  time: number;
  /** Duration of change */
  duration?: number;
  /** Data for the change */
  data?: Record<string, unknown>;
}
