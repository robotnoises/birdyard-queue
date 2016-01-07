// Task.js
// Various Task-related utility methods

var Firebase  = require('firebase');
var Config    = require('./../config/Config');

// Private

// Todo: check type

// Public

var _TYPE = Object.freeze({
  'ORPHANED_NODE': 0,
  'CALC_ROOM_SCORES': 1,
  'PRUNE_DEAD_ROOMS': 2
});

function _format(taskType, data) {
  return {
    'type': taskType,
    'data': data,
    'timestamp': Firebase.ServerValue.TIMESTAMP
  };
}

module.exports = {
  TYPE: _TYPE,
  format: _format
};