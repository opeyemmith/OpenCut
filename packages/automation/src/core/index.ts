/**
 * Core logic exports for @opencut/automation
 */

// Extractor
export {
  TemplateExtractor,
  createExtractor,
  type OpenCutProject,
  type OpenCutTrack,
  type OpenCutElement,
  type OpenCutMediaElement,
  type OpenCutTextElement,
  type MediaFileInfo,
  type ExtractionOptions,
} from "./extractor";

// Interpreter
export {
  TemplateInterpreter,
  createInterpreter,
  type GeneratedProject,
  type GeneratedProjectMetadata,
  type GeneratedTrack,
  type GeneratedElement,
  type GeneratedMediaElement,
  type GeneratedTextElement,
  type GeneratedMediaFile,
  type GenerationMetadata,
  type InterpreterConfig,
} from "./interpreter";

// Validator
export {
  validateTemplate,
  validatePlaceholderInputs,
  isValidTemplate,
  type TemplateValidationResult,
  type TemplateValidationError,
} from "./validator";
