import { openDB, type DBSchema } from 'idb';
import type { StorageAdapter } from "@clipfactory/platform-core";

interface ClipFactoryDB extends DBSchema {
  templates: {
    key: string;
    value: any;
  };
  projects: {
    key: string;
    value: any;
  };
  settings: {
    key: string;
    value: any;
  };
}

export class IndexedDBAdapter implements StorageAdapter {
  private dbName = "clipfactory-db";
  private version = 1;

  private async getDB() {
    return openDB<ClipFactoryDB>(this.dbName, this.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("templates")) {
          db.createObjectStore("templates", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      },
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const db = await this.getDB();
    const [storeName, id] = key.split(":");
    
    if (storeName && id && (storeName === "templates" || storeName === "projects")) {
        // @ts-ignore - Dynamic key usage
        return (await db.get(storeName, id)) as T || null;
    }
    
    return (await db.get("settings", key)) as T || null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    const [storeName, id] = key.split(":");

    if (storeName && id && (storeName === "templates" || storeName === "projects")) {
        // @ts-ignore - Dynamic key usage
        await db.put(storeName, value);
        return;
    }
    
    await db.put("settings", value, key);
  }

  async delete(key: string): Promise<void> {
    const db = await this.getDB();
    const [storeName, id] = key.split(":");

    if (storeName && id && (storeName === "templates" || storeName === "projects")) {
        // @ts-ignore - Dynamic key usage
        await db.delete(storeName, id);
        return;
    }
    
    await db.delete("settings", key);
  }

  async list(prefix: string): Promise<string[]> {
    const db = await this.getDB();
    if (prefix === "templates") return (await db.getAllKeys("templates")).map(k => `templates:${k}`);
    if (prefix === "projects") return (await db.getAllKeys("projects")).map(k => `projects:${k}`);
    // Return empty if unknown prefix
    return [];
  }

  async has(key: string): Promise<boolean> {
      const val = await this.get(key);
      return val !== null && val !== undefined;
  }

  async clear(): Promise<void> {
      const db = await this.getDB();
      await db.clear("templates");
      await db.clear("projects");
      await db.clear("settings");
  }
}

export const dbAdapter = new IndexedDBAdapter();
