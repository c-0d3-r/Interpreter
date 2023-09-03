import assert                            from 'assert';
import { isBoolean, isNumber, isString } from './utils';
import { Environment }                   from './environment';
import { isVariableName }                from './utils/is-variable-name.utils';

// type Operator = '+' | '*' | '-' | '/' | 'var';

// type Expression<T> = T extends [infer O, infer Arg1, infer Arg2]
//   ? O extends Extract<Operator, 'var'>
//     ? ['var', Arg1, Arg2]
//     : [O, Expression<Arg1>, Expression<Arg2>]
//   : T;
/**
 * Eva interpreter
 */
class Eva {
  public constructor(
    private readonly global = new Environment(
      new Map<any, any>([
        [null, null],
        [true, true],
        [false, false],
        ['VERSION', '1.0.0'],
      ])
    )
  ) {}

  public eval<const T>(exp: T, env = this.global): any {
    if (isNumber(exp)) return exp;

    if (isBoolean(exp)) return exp;

    if (isString(exp)) return exp.slice(1, -1);

    if (Array.isArray(exp)) {
      if (exp[0] === '+') return this.eval(exp[1]) + this.eval(exp[2]);

      if (exp[0] === '*') return this.eval(exp[1]) * this.eval(exp[2]);

      if (exp[0] === '/') return this.eval(exp[1]) / this.eval(exp[2]);

      if (exp[0] === '-') return this.eval(exp[1]) - this.eval(exp[2]);

      if (exp[0] === 'var') {
        const [_, name, value] = exp;

        return env.define(name, value);
      }
    }

    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${exp}`;
  }
}

// --------------------------------
// Tests:
// --------------------------------

const eva = new Eva();

// Math
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval(true), true);
assert.strictEqual(eva.eval('"1"'), '1');
assert.strictEqual(eva.eval(['+', 1, 2]), 3);
assert.strictEqual(eva.eval(['+', ['+', 1, 2], 3]), 6);
assert.strictEqual(eva.eval(['*', ['+', 1, 2], 3]), 9);
assert.strictEqual(eva.eval(['-', ['+', 1, 2], 3]), 0);

// Variables
assert.strictEqual(eva.eval(['var', 'x', 1]), 1);
assert.strictEqual(eva.eval('x'), 1);
assert.strictEqual(eva.eval('VERSION'), '1.0.0');
