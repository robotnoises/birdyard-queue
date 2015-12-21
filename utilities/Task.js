// Task.js
// Various Task-related utility methods

var Firebase = require('firebase');

// Private

// Todo: check type

// Public

var _TYPE = Object.freeze({
  ORPHANED_NODE: 0
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