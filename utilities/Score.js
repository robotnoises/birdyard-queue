var Q = require('q');

// Private

function getElapsedHours(timestamp, now, minimum) {
  var hours = Math.floor((Math.abs(now - timestamp) / 36e5));
  var min = minimum || 0;
  return (hours >= min) ? hours : min;
}

function getElapsedDays(elapsedHours, minimum) {
  var days = Math.floor(elapsedHours / 24);
  var min = minimum || 0;
  return (days >= min) ? days : min;
}

// Public

function _calc(commentCount, timestamp, now) {
  return Q.Promise(function (resolve, reject, notify) {
    var elapsedHours = getElapsedHours(timestamp, now);
    var elapsedDays  = getElapsedDays(elapsedHours);
    var count        = commentCount || 1; 
    resolve(((count - Math.pow(elapsedHours, elapsedDays)) / 1000) * -1);  
  });
}

module.exports = {
  calc: _calc
};