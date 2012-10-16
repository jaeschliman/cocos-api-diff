(function() {
  var assert, colorizeToArray;

  assert = require('assert');

  colorizeToArray = require('../lib/colorize').colorizeToArray;

  describe('colorize', function() {
    it("should return ' <value>' for a scalar value", function() {
      return assert.deepEqual([' 42'], colorizeToArray(42));
    });
    it("should return '-<old value>', '+<new value>' for a scalar diff", function() {
      return assert.deepEqual(['-42', '+10'], colorizeToArray({
        __old: 42,
        __new: 10
      }));
    });
    it("should return '-<removed key>: <removed value>' for an object diff with a removed key", function() {
      return assert.deepEqual([' {', '-  foo: 42', ' }'], colorizeToArray({
        foo__deleted: 42
      }));
    });
    it("should return '+<added key>: <added value>' for an object diff with an added key", function() {
      return assert.deepEqual([' {', '+  foo: 42', ' }'], colorizeToArray({
        foo__added: 42
      }));
    });
    it("should return '+<added key>: <added stringified value>' for an object diff with an added key and a non-scalar value", function() {
      return assert.deepEqual([' {', '+  foo: {', '+    bar: 42', '+  }', ' }'], colorizeToArray({
        foo__added: {
          bar: 42
        }
      }));
    });
    it("should return ' <modified key>: <colorized diff>' for an object diff with a modified key", function() {
      return assert.deepEqual([' {', '-  foo: 42', '+  foo: 10', ' }'], colorizeToArray({
        foo: {
          __old: 42,
          __new: 10
        }
      }));
    });
    it("should return '+<inserted item>' for an array diff", function() {
      return assert.deepEqual([' [', '   10', '+  20', '   30', ' ]'], colorizeToArray([[' ', 10], ['+', 20], [' ', 30]]));
    });
    return it("should return '-<deleted item>' for an array diff", function() {
      return assert.deepEqual([' [', '   10', '-  20', '   30', ' ]'], colorizeToArray([[' ', 10], ['-', 20], [' ', 30]]));
    });
  });

}).call(this);
