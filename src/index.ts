import assert                            from 'assert';
import { isBoolean, isNumber, isString } from './utils';

/**
 * Eva interpreter
 */
class Eva {
  public eval<T>(exp: T): any {
    if (isNumber(exp)) return exp;

    if (isBoolean(exp)) return exp;

    if (isString(exp)) return exp.slice(1, -1);

    if (Array.isArray(exp)) {
      if (exp[0] === '+') return this.eval(exp[1]) + this.eval(exp[2]);

      if (exp[0] === '*') return this.eval(exp[1]) * this.eval(exp[2]);

      if (exp[0] === '/') return this.eval(exp[1]) / this.eval(exp[2]);

      if (exp[0] === '-') return this.eval(exp[1]) - this.eval(exp[2]);
    }

    throw 'Not implemented';
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
