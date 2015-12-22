// Triage.js
// A Worker factory

var Task = require ('./../utilities/Task');
var Worker = require('./Worker');

// Private

function getWorker(taskType) {
  if (taskType === Task.TYPE.ORPHANED_NODE) {
    return Worker.createNode;
  }
  if (taskType === Task.TYPE.CALC_ROOM_SCORES) {
    return Worker.calcRoomScores;
  }
}

// Public

function _triage(data, progress, resolve, reject) {

  var fn = getWorker(data.type);
  
  fn(data).then(function () {
    resolve();  
  }).fail(function (error) {
    console.error(error);
    reject();  
  });
}

module.exports = _triage;