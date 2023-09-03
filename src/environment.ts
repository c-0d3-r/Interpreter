/**
 *  Environment: names storage
 */
export interface Environment {
  define<T>(name: string, value: T): T;
  lookup(name: string): any;
}

export class Environment {
  public constructor(private readonly record: Map<any, any> = new Map()) {}

  public define<T>(name: string, value: T): any {
    this.record.set(name, value);

    return value;
  }

  public lookup(name: string) {
    const variable = this.record.get(name);

    if (!variable) {
      throw new ReferenceError(`Undefined variable: ${name}`);
    }

    return variable;
  }
}
