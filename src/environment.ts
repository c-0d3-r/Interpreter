/**
 *  Environment: names storage
 */
export interface Environment {
  define<T>(name: string, value: T): T;
  lookup(name: string): any;
}

export class Environment {
  public constructor(
    private readonly record: Map<any, any> = new Map(),
    public parent: Environment | null = null
  ) {}

  public define<T>(name: string, value: T): any {
    this.record.set(name, value);

    return value;
  }

  public lookup(name: string): any {
    return this.resolve(name).record.get(name);
  }

  private resolve(name: string): Environment | never {
    if (this.record.has(name)) return this;

    if (!this.parent) {
      throw new ReferenceError(`Undefined variable: ${name}`);
    }

    return this.parent.resolve(name);
  }
}
