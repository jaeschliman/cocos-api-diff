(function() {
  var assert, diff;

  assert = require('assert');

  diff = require('../lib/index').diff;

  describe('diff', function() {
    describe('with simple scalar values', function() {
      it("should return undefined for two identical numbers", function() {
        return assert.deepEqual(void 0, diff(42, 42));
      });
      it("should return undefined for two identical strings", function() {
        return assert.deepEqual(void 0, diff("foo", "foo"));
      });
      return it("should return { __old: <old value>, __new: <new value> } object for two different numbers", function() {
        return assert.deepEqual({
          __old: 42,
          __new: 10
        }, diff(42, 10));
      });
    });
    describe('with objects', function() {
      it("should return undefined for two objects with identical contents", function() {
        return assert.deepEqual(void 0, diff({
          foo: 42,
          bar: 10
        }, {
          foo: 42,
          bar: 10
        }));
      });
      it("should return undefined for two object hierarchies with identical contents", function() {
        return assert.deepEqual(void 0, diff({
          foo: 42,
          bar: {
            bbbar: 10,
            bbboz: 11
          }
        }, {
          foo: 42,
          bar: {
            bbbar: 10,
            bbboz: 11
          }
        }));
      });
      it("should return { <key>__deleted: <old value> } when the second object is missing a key", function() {
        return assert.deepEqual({
          foo__deleted: 42
        }, diff({
          foo: 42,
          bar: 10
        }, {
          bar: 10
        }));
      });
      it("should return { <key>__added: <new value> } when the first object is missing a key", function() {
        return assert.deepEqual({
          foo__added: 42
        }, diff({
          bar: 10
        }, {
          foo: 42,
          bar: 10
        }));
      });
      it("should return { <key>: { __old: <old value>, __new: <new value> } } for two objects with diffent scalar values for a key", function() {
        return assert.deepEqual({
          foo: {
            __old: 42,
            __new: 10
          }
        }, diff({
          foo: 42
        }, {
          foo: 10
        }));
      });
      return it("should return { <key>: <diff> } with a recursive diff for two objects with diffent values for a key", function() {
        return assert.deepEqual({
          bar: {
            bbboz__deleted: 11,
            bbbar: {
              __old: 10,
              __new: 12
            }
          }
        }, diff({
          foo: 42,
          bar: {
            bbbar: 10,
            bbboz: 11
          }
        }, {
          foo: 42,
          bar: {
            bbbar: 12
          }
        }));
      });
    });
    describe('with arrays of scalars', function() {
      it("should return undefined for two arrays with identical contents", function() {
        return assert.deepEqual(void 0, diff([10, 20, 30], [10, 20, 30]));
      });
      it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function() {
        return assert.deepEqual([[' ', 10], ['-', 20], [' ', 30]], diff([10, 20, 30], [10, 30]));
      });
      it("should return [..., ['+', <added item>], ...] for two arrays when the second one has an extra value", function() {
        return assert.deepEqual([[' ', 10], ['+', 20], [' ', 30]], diff([10, 30], [10, 20, 30]));
      });
      return it("should return [..., ['+', <added item>]] for two arrays when the second one has an extra value at the end (edge case test)", function() {
        return assert.deepEqual([[' ', 10], [' ', 20], ['+', 30]], diff([10, 20], [10, 20, 30]));
      });
    });
    return describe('with arrays of objects', function() {
      it("should return undefined for two arrays with identical contents", function() {
        return assert.deepEqual(void 0, diff([
          {
            foo: 10
          }, {
            foo: 20
          }, {
            foo: 30
          }
        ], [
          {
            foo: 10
          }, {
            foo: 20
          }, {
            foo: 30
          }
        ]));
      });
      it("should return [..., ['-', <removed item>], ...] for two arrays when the second array is missing a value", function() {
        return assert.deepEqual([
          [' '], [
            '-', {
              foo: 20
            }
          ], [' ']
        ], diff([
          {
            foo: 10
          }, {
            foo: 20
          }, {
            foo: 30
          }
        ], [
          {
            foo: 10
          }, {
            foo: 30
          }
        ]));
      });
      it("should return [..., ['+', <added item>], ...] for two arrays when the second array has an extra value", function() {
        return assert.deepEqual([
          [' '], [
            '+', {
              foo: 20
            }
          ], [' ']
        ], diff([
          {
            foo: 10
          }, {
            foo: 30
          }
        ], [
          {
            foo: 10
          }, {
            foo: 20
          }, {
            foo: 30
          }
        ]));
      });
      return it("should return [..., ['~', <diff>], ...] for two arrays when an item has been modified (note: involves a crazy heuristic)", function() {
        return assert.deepEqual([
          [' '], [
            '~', {
              foo: {
                __old: 20,
                __new: 21
              }
            }
          ], [' ']
        ], diff([
          {
            foo: 10,
            bar: {
              bbbar: 10,
              bbboz: 11
            }
          }, {
            foo: 20,
            bar: {
              bbbar: 50,
              bbboz: 25
            }
          }, {
            foo: 30,
            bar: {
              bbbar: 92,
              bbboz: 34
            }
          }
        ], [
          {
            foo: 10,
            bar: {
              bbbar: 10,
              bbboz: 11
            }
          }, {
            foo: 21,
            bar: {
              bbbar: 50,
              bbboz: 25
            }
          }, {
            foo: 30,
            bar: {
              bbbar: 92,
              bbboz: 34
            }
          }
        ]));
      });
    });
  });

}).call(this);
