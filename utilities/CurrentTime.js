var Firebase  = require('firebase');
var Q         = require('q');

module.exports = function ($firebaseRef) {
  return Q.Promise(function (resolve, reject, notify) {
    var $ref = $firebaseRef.root().child('firebase');
    $ref.set({'current_time': Firebase.ServerValue.TIMESTAMP});
    $ref.once('value', function ($snap) {
      resolve($snap.val());  
    });
  });
}