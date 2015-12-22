// Queue.js
// Fetch Tasks from the Queue

var Config  = require('./../config/Config');
var Triage  = require('./Triage');
var Queue   = require('firebase-queue');

function _start(firebaseInstance) {
  
  this.firebase = firebaseInstance; 
  
  var $ref = this.firebase.child(Config.QUEUE_PATH);
  var queue = new Queue($ref, Triage);
  
  // Graceful shutdown
  process.on('SIGINT', function() {
    console.log('Starting queue shutdown');
    queue.shutdown().then(function() {
      console.log('Finished queue shutdown');
      process.exit(0);
    });
  });
}

module.exports = {
  start: _start
};