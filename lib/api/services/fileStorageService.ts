import { promises as fs } from "fs";
import path from "path";

export class FileStorageService {
  private dataDir = path.join(process.cwd(), "data");

  async ensureDataDir() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  async readJsonFile<T>(filename: string): Promise<T[]> {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, filename);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is empty
      console.warn(
        `File ${filename} not found or empty. Returning empty array.`,
        error,
      );
      return [];
    }
  }

  async writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
    await this.ensureDataDir();
    const filePath = path.join(this.dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async findById<T extends { id: string }>(
    filename: string,
    id: string,
  ): Promise<T | null> {
    const items = await this.readJsonFile<T>(filename);
    return items.find((item) => item.id === id) || null;
  }

  async create<T extends { id: string }>(
    filename: string,
    item: T,
  ): Promise<T> {
    const items = await this.readJsonFile<T>(filename);
    items.push(item);
    await this.writeJsonFile(filename, items);
    return item;
  }

  async update<T extends { id: string }>(
    filename: string,
    id: string,
    updates: Partial<T>,
  ): Promise<T | null> {
    const items = await this.readJsonFile<T>(filename);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    await this.writeJsonFile(filename, items);
    return items[index];
  }

  async delete(filename: string, id: string): Promise<boolean> {
    const items = await this.readJsonFile<{ id: string }>(filename);
    const filteredItems = items.filter((item) => item.id !== id);
    if (filteredItems.length === items.length) return false;

    await this.writeJsonFile(filename, filteredItems);
    return true;
  }

  async findMany<T>(
    filename: string,
    filter?: (item: T) => boolean,
  ): Promise<T[]> {
    const items = await this.readJsonFile<T>(filename);
    return filter ? items.filter(filter) : items;
  }
}
