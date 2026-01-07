/**
 * @clipfactory/events
 *
 * Type-safe event bus for platform-wide communication.
 * Enables decoupled components to react to system events.
 */

// ============================================
// Event Types
// ============================================

export type PlatformEvent =
  // Template events
  | { type: "template:created"; templateId: string; name: string }
  | { type: "template:updated"; templateId: string }
  | { type: "template:deleted"; templateId: string }
  | { type: "template:applied"; templateId: string; projectId: string }

  // Project events
  | { type: "project:created"; projectId: string; name: string }
  | { type: "project:opened"; projectId: string }
  | { type: "project:saved"; projectId: string }
  | { type: "project:handoff"; projectId: string; url: string }

  // Export events
  | { type: "export:started"; jobId: string; projectId: string }
  | { type: "export:progress"; jobId: string; progress: number }
  | { type: "export:completed"; jobId: string; outputPath: string }
  | { type: "export:failed"; jobId: string; error: string }

  // Batch events
  | { type: "batch:started"; batchId: string; totalItems: number }
  | { type: "batch:progress"; batchId: string; completed: number; total: number }
  | { type: "batch:completed"; batchId: string }
  | { type: "batch:failed"; batchId: string; error: string };

// Extract event type string union
export type EventType = PlatformEvent["type"];

// Extract specific event by type
export type EventByType<T extends EventType> = Extract<
  PlatformEvent,
  { type: T }
>;

// Event handler type
export type EventHandler<T extends EventType> = (event: EventByType<T>) => void;

// ============================================
// Event Bus Interface
// ============================================

export interface EventBus {
  /**
   * Emit an event to all registered handlers
   */
  emit<T extends PlatformEvent>(event: T): void;

  /**
   * Subscribe to a specific event type
   * @returns Unsubscribe function
   */
  on<T extends EventType>(type: T, handler: EventHandler<T>): () => void;

  /**
   * Subscribe to an event type for a single emission only
   */
  once<T extends EventType>(type: T, handler: EventHandler<T>): () => void;

  /**
   * Remove all handlers for a specific event type
   */
  off(type: EventType): void;

  /**
   * Clear all event handlers
   */
  clear(): void;
}

// ============================================
// Event Bus Implementation
// ============================================

export function createEventBus(): EventBus {
  const handlers = new Map<EventType, Set<EventHandler<any>>>();

  return {
    emit(event) {
      const eventHandlers = handlers.get(event.type);
      if (eventHandlers) {
        eventHandlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error(
              `[EventBus] Error in handler for ${event.type}:`,
              error
            );
          }
        });
      }
    },

    on(type, handler) {
      if (!handlers.has(type)) {
        handlers.set(type, new Set());
      }
      handlers.get(type)!.add(handler);

      // Return unsubscribe function
      return () => {
        handlers.get(type)?.delete(handler);
      };
    },

    once(type, handler) {
      const wrappedHandler: EventHandler<typeof type> = (event) => {
        handler(event);
        handlers.get(type)?.delete(wrappedHandler);
      };

      if (!handlers.has(type)) {
        handlers.set(type, new Set());
      }
      handlers.get(type)!.add(wrappedHandler);

      return () => {
        handlers.get(type)?.delete(wrappedHandler);
      };
    },

    off(type) {
      handlers.delete(type);
    },

    clear() {
      handlers.clear();
    },
  };
}

// ============================================
// Singleton Instance
// ============================================

let globalEventBus: EventBus | null = null;

/**
 * Get the global event bus instance (singleton)
 */
export function getEventBus(): EventBus {
  if (!globalEventBus) {
    globalEventBus = createEventBus();
  }
  return globalEventBus;
}

/**
 * Reset the global event bus (useful for testing)
 */
export function resetEventBus(): void {
  globalEventBus?.clear();
  globalEventBus = null;
}
