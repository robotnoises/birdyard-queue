// Triage.js
// A Worker factory

var Task = require ('./../utilities/Task');
var Worker = require('./Worker');

// Private

function getWorker(taskType) {
  if (taskType === Task.TYPE.ORPHANED_NODE) {
    return Worker.createNode;
  }
}

// Public

function _triage(data, progress, resolve, reject) {

  var fn = getWorker(data.type);
  
  fn(data).then(function () {
    resolve();  
  }).fail(function (error) {
    reject();  
  });
}

module.exports = _triage;