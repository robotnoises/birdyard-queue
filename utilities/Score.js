var Q = require('q');

// Private

function getElapsedHours(timestamp, now, minimum) {
  var hours = Math.ceil((Math.abs(now - timestamp) / 36e5));
  var min = minimum || 0;
  return (hours >= min) ? hours : min;
}

function getElapsedDays(elapsedHours, minimum) {
  var days = Math.ceil(elapsedHours / 24);
  var min = minimum || 0;
  return (days >= min) ? days : min;
}

// Public

function _calc(commentCount, timestamp, now) {
  return Q.Promise(function (resolve, reject, notify) {
    var elapsedHours = getElapsedHours(timestamp, now, 1);
    var elapsedDays   = getElapsedDays(elapsedHours, 1);
    resolve((commentCount - Math.pow(elapsedHours, elapsedDays)) * -0.001);  
  });
}

module.exports = {
  calc: _calc
};