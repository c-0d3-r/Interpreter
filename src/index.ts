import assert                            from 'assert';
import { isBoolean, isNumber, isString } from './utils';
import { Environment }                   from './environment';
import { isVariableName }                from './utils/is-variable-name.utils';

enum Operator {
  PLUS = '+',
  MINUS = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}

enum Keyword {
  VAR = 'var',
  BEGIN = 'begin',
}

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
      if (exp[0] === Operator.PLUS)
        return this.eval(exp[1]) + this.eval(exp[2]);

      if (exp[0] === Operator.MULTIPLY)
        return this.eval(exp[1]) * this.eval(exp[2]);

      if (exp[0] === Operator.DIVIDE)
        return this.eval(exp[1]) / this.eval(exp[2]);

      if (exp[0] === Operator.MINUS)
        return this.eval(exp[1]) - this.eval(exp[2]);

      if (exp[0] === Keyword.VAR) {
        const [_, name, value] = exp;

        return env.define(name, this.eval(value));
      }

      if (exp[0] === Keyword.BEGIN) {
        const [_, ...rest] = exp;

        let result: any;

        for (const exp of rest) {
          result = this.eval(exp, env);
        }

        return result;
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
assert.strictEqual(eva.eval(['var', 'isUser', true]), true);
assert.strictEqual(eva.eval('isUser'), true);
assert.strictEqual(eva.eval(['var', 'y', ['+', 1, 2]]), 3);

// Blocks
assert.strictEqual(
  eva.eval([
    'begin',
    ['var', 'x', 10],
    ['var', 'y', 20],
    ['+', ['*', 'x', 'y'], 30],
  ]),
  230
);
