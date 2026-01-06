/**
 * Web Storage Adapter
 *
 * Implements StorageAdapter for web browsers using IndexedDB.
 * This is the platform-specific storage implementation for the web.
 */

import type {
  StorageAdapter,
  TemplateSummary,
} from "@opencut/automation/types";
import type { AutomationTemplate } from "@opencut/automation/types";
import { generateId, getCurrentTimestamp } from "@opencut/automation/utils";

// IndexedDB configuration
const DB_NAME = "opencut-automation";
const DB_VERSION = 1;
const TEMPLATES_STORE = "templates";

/**
 * IndexedDB-based storage adapter for web.
 */
export class WebStorageAdapter implements StorageAdapter {
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Get or create the database connection.
   */
  private async getDatabase(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open automation database:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create templates store if it doesn't exist
        if (!db.objectStoreNames.contains(TEMPLATES_STORE)) {
          const store = db.createObjectStore(TEMPLATES_STORE, {
            keyPath: "id",
          });

          // Create indexes for searching
          store.createIndex("name", "name", { unique: false });
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Save a template to IndexedDB.
   */
  async saveTemplate(template: AutomationTemplate): Promise<void> {
    const db = await this.getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(TEMPLATES_STORE, "readwrite");
      const store = transaction.objectStore(TEMPLATES_STORE);

      // Update the updatedAt timestamp
      const templateToSave = {
        ...template,
        updatedAt: getCurrentTimestamp(),
      };

      const request = store.put(templateToSave);

      request.onerror = () => {
        console.error("Failed to save template:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Load a template by ID.
   */
  async loadTemplate(id: string): Promise<AutomationTemplate | null> {
    const db = await this.getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(TEMPLATES_STORE, "readonly");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.get(id);

      request.onerror = () => {
        console.error("Failed to load template:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result || null);
      };
    });
  }

  /**
   * List all templates (summaries only).
   */
  async listTemplates(): Promise<TemplateSummary[]> {
    const db = await this.getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(TEMPLATES_STORE, "readonly");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.getAll();

      request.onerror = () => {
        console.error("Failed to list templates:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const templates: AutomationTemplate[] = request.result || [];

        // Convert to summaries
        const summaries: TemplateSummary[] = templates.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          placeholderCount: t.placeholders.length,
          trackCount: t.tracks.length,
          ruleCount: t.rules.length,
          sourceProjectId: t.sourceProjectId,
        }));

        // Sort by updatedAt descending
        summaries.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        resolve(summaries);
      };
    });
  }

  /**
   * Delete a template by ID.
   */
  async deleteTemplate(id: string): Promise<void> {
    const db = await this.getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(TEMPLATES_STORE, "readwrite");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.delete(id);

      request.onerror = () => {
        console.error("Failed to delete template:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }

  /**
   * Search templates by name or description.
   */
  async searchTemplates(query: string): Promise<TemplateSummary[]> {
    const allTemplates = await this.listTemplates();
    const queryLower = query.toLowerCase();

    return allTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(queryLower) ||
        t.description.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Update an existing template.
   */
  async updateTemplate(
    id: string,
    updates: Partial<AutomationTemplate>
  ): Promise<void> {
    const existing = await this.loadTemplate(id);

    if (!existing) {
      throw new Error(`Template with id ${id} not found`);
    }

    const updated: AutomationTemplate = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: getCurrentTimestamp(),
    };

    await this.saveTemplate(updated);
  }

  /**
   * Duplicate a template with a new ID.
   */
  async duplicateTemplate(
    id: string,
    newName: string
  ): Promise<AutomationTemplate> {
    const existing = await this.loadTemplate(id);

    if (!existing) {
      throw new Error(`Template with id ${id} not found`);
    }

    const duplicate: AutomationTemplate = {
      ...existing,
      id: generateId(),
      name: newName,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      sourceProjectId: existing.sourceProjectId,
    };

    await this.saveTemplate(duplicate);
    return duplicate;
  }

  /**
   * Export a template as JSON string.
   */
  async exportTemplate(id: string): Promise<string> {
    const template = await this.loadTemplate(id);

    if (!template) {
      throw new Error(`Template with id ${id} not found`);
    }

    return JSON.stringify(template, null, 2);
  }

  /**
   * Import a template from JSON string.
   */
  async importTemplate(json: string): Promise<AutomationTemplate> {
    let parsed: unknown;

    try {
      parsed = JSON.parse(json);
    } catch {
      throw new Error("Invalid JSON");
    }

    // Basic validation
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as Record<string, unknown>).version !== "1.0"
    ) {
      throw new Error("Invalid template format");
    }

    const template = parsed as AutomationTemplate;

    // Generate new ID to avoid conflicts
    const importedTemplate: AutomationTemplate = {
      ...template,
      id: generateId(),
      name: `${template.name} (Imported)`,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    await this.saveTemplate(importedTemplate);
    return importedTemplate;
  }

  /**
   * Clear all templates (for testing/reset).
   */
  async clearAll(): Promise<void> {
    const db = await this.getDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(TEMPLATES_STORE, "readwrite");
      const store = transaction.objectStore(TEMPLATES_STORE);
      const request = store.clear();

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve();
      };
    });
  }
}

/**
 * Create a web storage adapter instance.
 */
export function createWebStorageAdapter(): WebStorageAdapter {
  return new WebStorageAdapter();
}
