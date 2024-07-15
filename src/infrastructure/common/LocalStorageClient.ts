export class LocalStorageClient {

  private static instance: LocalStorageClient;

  private constructor() { }

  public static getInstance(): LocalStorageClient {
    if (!LocalStorageClient.instance) {
      LocalStorageClient.instance = new LocalStorageClient();
    }
    return LocalStorageClient.instance;
  }

  public setItem<T>(key: string, value: T): void {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  }

  public getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  public getAllKeys(): string[] {
    return Object.keys(localStorage);
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  public clear(): void {
    localStorage.clear();
  }

}
