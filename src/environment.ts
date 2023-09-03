/**
 *  Environment: names storage
 */
export interface Environment {
  define<T>(name: string, value: T): T;
}

export class Environment {
  private record = new Map<string, any>();
  public define<T>(name: string, value: T): any {
    this.record.set(name, value);

    return value;
  }
}
