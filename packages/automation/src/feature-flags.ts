/**
 * Feature flags for controlling automation capabilities.
 * Use these to enable/disable features per phase.
 */

export interface AutomationFeatureFlags {
  // ===== MVP Features (Phase 1) =====
  /** Enable template extraction from projects */
  templateExtraction: boolean;
  /** Enable template application to create new projects */
  templateApplication: boolean;
  /** Enable manual caption creation */
  manualCaptions: boolean;
  /** Enable basic placeholder system */
  basicPlaceholders: boolean;

  // ===== Phase 2 Features =====
  /** Enable automatic transcription */
  autoTranscription: boolean;
  /** Enable keyword-based text highlighting */
  keywordHighlighting: boolean;
  /** Enable silence detection and removal */
  silenceDetection: boolean;

  // ===== Phase 3 Features =====
  /** Enable automatic scene detection */
  sceneDetection: boolean;
  /** Enable audio peak detection for effects */
  audioPeakDetection: boolean;
  /** Enable batch generation of multiple videos */
  batchGeneration: boolean;
  /** Enable automatic zoom effects */
  zoomEffects: boolean;
}

/**
 * Default feature flags for MVP release.
 * Only Phase 1 features are enabled by default.
 */
export const DEFAULT_FEATURE_FLAGS: AutomationFeatureFlags = {
  // MVP - enabled
  templateExtraction: true,
  templateApplication: true,
  manualCaptions: true,
  basicPlaceholders: true,

  // Phase 2 - disabled
  autoTranscription: false,
  keywordHighlighting: false,
  silenceDetection: false,

  // Phase 3 - disabled
  sceneDetection: false,
  audioPeakDetection: false,
  batchGeneration: false,
  zoomEffects: false,
};

/**
 * Check if a specific feature is enabled.
 */
export function isFeatureEnabled(
  flags: AutomationFeatureFlags,
  feature: keyof AutomationFeatureFlags
): boolean {
  return flags[feature] === true;
}

/**
 * Create a custom feature flags configuration.
 */
export function createFeatureFlags(
  overrides: Partial<AutomationFeatureFlags>
): AutomationFeatureFlags {
  return {
    ...DEFAULT_FEATURE_FLAGS,
    ...overrides,
  };
}
