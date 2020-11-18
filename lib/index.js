'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _table = require('../table');

Object.defineProperty(exports, 'Table', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_table).default;
  }
});

var _hooks = require('../hooks');

Object.defineProperty(exports, 'useTableSync', {
  enumerable: true,
  get: function get() {
    return _hooks.useTableSync;
  }
});
Object.defineProperty(exports, 'useTableAsync', {
  enumerable: true,
  get: function get() {
    return _hooks.useTableAsync;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }