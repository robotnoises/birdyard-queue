var Firebase  = require('firebase');
var Q         = require('q');

module.exports = function(firebaseUrl, token) {
  
  var $fb = new Firebase(firebaseUrl);
  
  console.log('Authenticating...');
  
  return Q.Promise(function (resolve, reject, notify) {
    $fb.authWithCustomToken(token, function (error) {
      if (error) {
        console.error('Invalid token, cannot auth to Firebase');
        throw new Error('Invalid token, cannot auth to Firebase');
      } else {
        console.log('Succesfully authenticated to ' + firebaseUrl + '!');
        resolve($fb);
      }
    });
  });
};