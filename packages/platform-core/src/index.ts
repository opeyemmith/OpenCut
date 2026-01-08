/**
 * @clipfactory/platform-core
 *
 * Platform-agnostic core logic and adapter interfaces.
 * This package contains no platform-specific code.
 */

// Types
export * from "./types";

// Validation
export * from "./validation";

// Re-export events for convenience
export { getEventBus, createEventBus, type EventBus, type PlatformEvent } from "@clipfactory/events";
