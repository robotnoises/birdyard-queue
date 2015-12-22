// Worker.js
// Various methods to process Tasks

var Q           = require('q');
var Config      = require('./../config/Config');
var Score       = require('./../utilities/Score');
var CurrentTime = require('./../utilities/CurrentTime');

var $firebase;

// Private

function getTopNode(nodeId) {
  return Q.Promise(function (resolve, reject, notify) {
    var $ref = $firebase.child('nodes/' + nodeId);
    $ref.once('value', function ($snap) {
      resolve($snap.val());
    }, reject)
  });
}

function getScore(room, now) {
  return Q.Promise(function (resolve, reject, notify) {
    return getTopNode(room.nodeId).then(function (node) {
      return Score.calc(node.commentCount, room.timestamp, now);
    }).then(function (score) {
      room.score = score;
      resolve(room);
    });
  });
}

function updateRoom(location, room) {
  return Q.Promise(function (resolve, reject, notify) {
    var $ref = $firebase.child(location);
    $ref.update({'score': room.score}, resolve);
  });
}

// Public

// Create a new node at a certain location
function _createNode(task) {
  return Q.Promise(function (resolve, reject, notify) {
    
    $firebase = this.firebase;
    var location = task.data.origin;
    
    // Clean-up node
    var data = task.data.data;
    
    data.origin = '';
    delete data.breadcrumb;
    delete data.children;
    
    var $ref = $firebase.child(location);
    
    $ref.set(data, resolve);
  });
}

// Calculate scores for rooms
function _calcRoomScores(task) {
  
  console.log('Calculating Room scores');
  
  return Q.Promise(function(resolve, reject, notify) {
    
    $firebase = this.firebase;
    var $ref = $firebase.child('rooms/everything');
    
    $ref.once('value', function ($rooms) {
      
      var rooms = $rooms.val();
      
      return CurrentTime($firebase)
        .then(function (timestamp) {
          
          var promises = [];
          var now = timestamp.current_time;
          
          for (var key in rooms) {
            if (!rooms.hasOwnProperty(key)) continue;
            promises.push(getScore(rooms[key], now))
          }
          
          return Q.allSettled(promises);
        }).then(function (scoredRooms) {
          
          var promises = [];
          
          scoredRooms.forEach(function (sr) {
            if (sr.state === 'fulfilled') {
              promises.push(updateRoom('rooms/everything/' + sr.value.id, sr.value));
              promises.push(updateRoom('rooms/news/' + sr.value.categoryId, sr.value));
              return Q.allSettled(promises);
            }
          });
        }).then(function () {
        console.log('Finished calculating Room scores');
        resolve();
      });
    }, reject);
  });
}

module.exports = {
  createNode: _createNode,
  calcRoomScores: _calcRoomScores
};