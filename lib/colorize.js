// Generated by IcedCoffeeScript 1.2.0t
(function() {
  var Theme, color, colorize, colorizeToArray, colorizeWithAnsiEscapes, extendedTypeOf, subcolorize,
    __hasProp = {}.hasOwnProperty;

  color = require('cli-color');

  extendedTypeOf = require('./util').extendedTypeOf;

  Theme = {
    ' ': function(s) {
      return s;
    },
    '+': color.green,
    '-': color.red
  };

  subcolorize = function(key, diff, output, color, indent) {
    var item, looksLikeDiff, m, op, prefix, subindent, subkey, subvalue, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    prefix = key ? "" + key + ": " : '';
    subindent = indent + '  ';
    switch (extendedTypeOf(diff)) {
      case 'object':
        if (('__old' in diff) && ('__new' in diff) && (Object.keys(diff).length === 2)) {
          subcolorize(key, diff.__old, output, '-', indent);
          return subcolorize(key, diff.__new, output, '+', indent);
        } else {
          output(color, "" + indent + prefix + "{");
          for (subkey in diff) {
            if (!__hasProp.call(diff, subkey)) continue;
            subvalue = diff[subkey];
            if (m = subkey.match(/^(.*)__deleted$/)) {
              subcolorize(m[1], subvalue, output, '-', subindent);
            } else if (m = subkey.match(/^(.*)__added$/)) {
              subcolorize(m[1], subvalue, output, '+', subindent);
            } else {
              subcolorize(subkey, subvalue, output, color, subindent);
            }
          }
          return output(color, "" + indent + "}");
        }
        break;
      case 'array':
        output(color, "" + indent + prefix + "[");
        looksLikeDiff = true;
        for (_i = 0, _len = diff.length; _i < _len; _i++) {
          item = diff[_i];
          if ((extendedTypeOf(item) !== 'array') || (item.length !== 2) || !(typeof item[0] === 'string') || item[0].length !== 1 || !((_ref = item[0]) === ' ' || _ref === '-' || _ref === '+' || _ref === '~')) {
            looksLikeDiff = false;
          }
        }
        if (looksLikeDiff) {
          for (_j = 0, _len2 = diff.length; _j < _len2; _j++) {
            _ref2 = diff[_j], op = _ref2[0], subvalue = _ref2[1];
            if (op === ' ' && !(subvalue != null)) {
              subcolorize('', '...', output, ' ', subindent);
            } else {
              if (op !== ' ' && op !== '~' && op !== '+' && op !== '-') {
                throw new Error("Unexpected op '" + op + "' in " + (JSON.stringify(diff, null, 2)));
              }
              if (op === '~') op = ' ';
              subcolorize('', subvalue, output, op, subindent);
            }
          }
        } else {
          for (_k = 0, _len3 = diff.length; _k < _len3; _k++) {
            subvalue = diff[_k];
            subcolorize('', subvalue, output, color, subindent);
          }
        }
        return output(color, "" + indent + "]");
      default:
        return output(color, indent + prefix + JSON.stringify(diff));
    }
  };

  colorize = function(diff, output) {
    return subcolorize('', diff, output, ' ', '');
  };

  colorizeToArray = function(diff) {
    var output;
    output = [];
    colorize(diff, function(color, line) {
      return output.push("" + color + line);
    });
    return output;
  };

  colorizeWithAnsiEscapes = function(diff, options) {
    var output;
    if (options == null) options = {};
    output = [];
    colorize(diff, function(color, line) {
      if (options.color) {
        return output.push(Theme[color]("" + color + line) + "\n");
      } else {
        return output.push("" + color + line + "\n");
      }
    });
    return output.join('');
  };

  module.exports = {
    colorize: colorize,
    colorizeToArray: colorizeToArray,
    colorizeWithAnsiEscapes: colorizeWithAnsiEscapes
  };

}).call(this);
