import { FileAdapter, FileInfo } from "@clipfactory/platform-core";

export class OPFSFileAdapter implements FileAdapter {
  private root: FileSystemDirectoryHandle | null = null;

  private async getRoot() {
    if (!this.root) {
      this.root = await navigator.storage.getDirectory();
    }
    return this.root;
  }

  private async getFileHandle(path: string, create = false) {
    const root = await this.getRoot();
    const parts = path.split("/").filter((p) => p.length > 0);
    let current = root;

    for (let i = 0; i < parts.length - 1; i++) {
        // @ts-ignore - TS types for File System Access API might be missing or incomplete in simple environments
       current = await current.getDirectoryHandle(parts[i], { create });
    }

    return await current.getFileHandle(parts[parts.length - 1], { create });
  }

  private async getDirHandle(path: string, create = false) {
    const root = await this.getRoot();
    const parts = path.split("/").filter((p) => p.length > 0);
    let current = root;

    for (const part of parts) {
      current = await current.getDirectoryHandle(part, { create });
    }
    return current;
  }

  async read(path: string): Promise<ArrayBuffer> {
    const handle = await this.getFileHandle(path);
    const file = await handle.getFile();
    return await file.arrayBuffer();
  }

  async readText(path: string): Promise<string> {
    const handle = await this.getFileHandle(path);
    const file = await handle.getFile();
    return await file.text();
  }

  async write(path: string, data: ArrayBuffer | string): Promise<void> {
    const handle = await this.getFileHandle(path, true);
    // @ts-ignore
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async delete(path: string): Promise<void> {
    const root = await this.getRoot();
    const parts = path.split("/").filter(p => p.length > 0);
    
    // Simplification for MVP: assumes file is in root or we need complex traversal to delete
    // For now, let's just try to remove from root for flat structure or implement proper parent lookup
    // Proper way: get parent handle, then removeEntry
    if (parts.length === 1) {
        await root.removeEntry(parts[0]);
    } else {
        // TODO: Implement deep deletion walking
        console.warn("Deep delete not fully implemented in MVP adapter");
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.getFileHandle(path);
      return true;
    } catch {
      return false;
    }
  }

  async listDir(path: string): Promise<FileInfo[]> {
    const dirHandle = path === "/" || path === "" ? await this.getRoot() : await this.getDirHandle(path);
    const result: FileInfo[] = [];

    // @ts-ignore - async iteration
    for await (const [name, handle] of dirHandle.entries()) {
      const isDirectory = handle.kind === 'directory';
      let size = 0;
      let modifiedAt = new Date();

      if (!isDirectory) {
          const file = await handle.getFile();
          size = file.size;
          modifiedAt = new Date(file.lastModified);
      }

      result.push({
        name,
        path: `${path}/${name}`,
        isDirectory,
        size,
        modifiedAt
      });
    }

    return result;
  }

  async mkdir(path: string): Promise<void> {
    await this.getDirHandle(path, true);
  }

  async copy(from: string, to: string): Promise<void> {
    const data = await this.read(from);
    await this.write(to, data);
  }

  async stat(path: string): Promise<FileInfo> {
    const handle = await this.getFileHandle(path);
    const file = await handle.getFile();
    return {
      name: file.name,
      path: path,
      isDirectory: false,
      size: file.size,
      modifiedAt: new Date(file.lastModified)
    };
  }
}

export const fileAdapter = new OPFSFileAdapter();
