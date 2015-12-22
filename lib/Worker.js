// Worker.js
// Various methods to process Tasks

var Q       = require('q');
var Config  = require('./../config/Config');

// Create a new node at a certain location
function _createNode(task) {
  return Q.Promise(function (resolve, reject, notify) {
    
    var firebase = this.firebase;
    var location = task.data.origin;
    
    // Clean-up node
    var data = task.data.data;
    
    data.origin = '';
    delete data.breadcrumb;
    delete data.children;
    
    var $ref = firebase.child(location);
    
    $ref.set(data, resolve);
  });
}

// Calculate scores for rooms
function _calcRoomScores(task) {
  
  console.log('Calculating Room scores');
  
  return Q.Promise(function(resolve, reject, notify) {
    
    var firebase = this.firebase;
    var $ref = firebase.child('rooms/everything');
    
    return $ref.once('value', function ($rooms) {
      
      var rooms = $rooms.val();
      var $roomsRef = $rooms.ref();
      
      for (var key in rooms) {
        if (rooms.hasOwnProperty(key)) {
          var room = rooms[key];
          room.score = Math.random() -1;
          $roomsRef.child(room.id).set(room);  
        }
      }
      console.log('Finished calculating Room scores');
      resolve();
    }, reject);
  });
}

module.exports = {
  createNode: _createNode,
  calcRoomScores: _calcRoomScores
};