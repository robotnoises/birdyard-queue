var Q = require('q');

var $fb;

// Private

function monitor(paths) {
  
  console.log('Start monitoring firebase locations');
  
  // Firebase instance to be referenced by callbacks
  this.firebase = $fb;

  for (var key in paths) {
    if (paths.hasOwnProperty(key)) {
      var path = paths[key];
      this.firebase.child(path.location).on(path.event, path.handler);  
    }
  }
}

// Public

function _start(firebaseInstance, paths) {
  
  console.log('Starting the Dispatcher');
  
  // Ref a Firebase Instance
  $fb = firebaseInstance;
  
  // Monitor these paths
  monitor(paths);
}

module.exports = {
  start: _start
};