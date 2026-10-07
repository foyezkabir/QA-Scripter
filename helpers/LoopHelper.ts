export class LoopHelper {
  static async retryUntil<T>(read: () => Promise<T | undefined>, attempts: number, delayMs: number): Promise<T | undefined> {
    for (let attempt = 0; attempt < attempts; attempt++) {
      const value = await read();
      if (value !== undefined) {
        return value;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return undefined;
  }
}
