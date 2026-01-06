/**
 * Type exports for @opencut/automation
 *
 * This file re-exports all types for convenient importing:
 * @example import { AutomationTemplate, PlaceholderDefinition } from '@opencut/automation/types';
 */

// Template types
export type {
  AutomationTemplate,
  CanvasSettings,
  TemplateTrack,
  TrackRole,
  TemplateElement,
  ElementTiming,
  ElementDuration,
  TemplateContent,
  ElementPosition,
  TextStyleDefinition,
  CaptionStyleDefinition,
  CaptionAnimation,
  CaptionGrouping,
} from "./template";

// Placeholder types
export type {
  PlaceholderDefinition,
  PlaceholderType,
  PlaceholderConstraints,
  PlaceholderDefaultValue,
  AutomationInputs,
  PlaceholderInput,
  MediaMetadata,
  AutomationOptions,
  PlaceholderValidationResult,
  PlaceholderValidationError,
  PlaceholderErrorCode,
} from "./placeholder";

// Rule types
export type {
  AutomationRule,
  RuleCategory,
  RuleTrigger,
  SilenceTrigger,
  KeywordTrigger,
  ManualTrigger,
  SceneChangeTrigger,
  AudioPeakTrigger,
  TimestampTrigger,
  DurationTrigger,
  RuleAction,
  CutAction,
  HighlightTextAction,
  InsertPauseAction,
  ChangeStyleAction,
  ZoomAction,
  AddEffectAction,
  SpeedChangeAction,
  InsertElementAction,
  RuleExecutionContext,
  RuleExecutionResult,
  TimelineChange,
} from "./rules";

// Transcript types
export type {
  Transcript,
  TranscriptWord,
  TranscriptSegment,
  TranscriptMetadata,
  TranscriptionInput,
  AudioSource,
  TranscriptionResult,
  CaptionGenerationOptions,
  CaptionGroupingOptions,
  KeywordHighlight,
  GeneratedCaption,
} from "./transcript";

// Adapter types
export type {
  StorageAdapter,
  TemplateSummary,
  TranscriptionAdapter,
  LanguageInfo,
  FileAdapter,
  MediaInput,
  MediaInfo,
  AnalyticsAdapter,
  AutomationAdapters,
  AutomationConfig,
} from "./adapters";
