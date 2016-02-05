// Worker.js
// Various methods to process Tasks

var Q           = require('q');
var Config      = require('./../config/Config');
var Score       = require('./../utilities/Score');
var CurrentTime = require('./../utilities/CurrentTime');
var Categories  = require('./../utilities/Categories');

var $firebase;

// Private

function getScore(room, now) {
  return Q.Promise(function (resolve, reject, notify) {
    return Score.calc(room.commentCount, room.timestamp, now).then(function (score) {
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

function remove(loc) {
  return Q.Promise(function (resolve, reject, notify) {
    
    console.log('Removing', loc);
    
    try {
      var $ref = $firebase.child(loc);
      $ref.remove();  
      resolve();  
    } catch(ex) {
      reject(ex);
    }
  });
}

// Public

// Create a new node at a certain location
function _createNode(task) {
  return Q.Promise(function (resolve, reject, notify) {
    
    $firebase = $firebase || this.firebase;
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
    
    $firebase = $firebase || this.firebase;
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
              promises.push(updateRoom('rooms/' + Categories.getName(sr.value.category) + '/' + sr.value.categoryId, sr.value));
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

function _pruneDeadRooms(data) {
  
  console.log('Finding Rooms with score above threshold of:', Config.ROOM_SCORE_THRESHOLD);
  
  return Q.promise(function (resolve, reject, notify) {
    
    $firebase = $firebase || this.firebase;
    
    var $ref = $firebase.child('rooms/everything');
    var promises = [];
    var numPruned = 0;
    
    $ref.once('value', function ($snap) {
      $snap.forEach(function ($item) {
        
        var roomKey = $item.key();
        var item = $item.val();
        
        // A rooms is dead if its score is above 0... E.g. a good score 
        // is in the negative (this is for sorting purposes)
        
        if (item.score > 0) {
          promises.push(remove('rooms/everything/' + roomKey));
          promises.push(remove('rooms/' + Categories.getName(item.category) + '/' + item.categoryId));
          numPruned++;
        }
      });
    }, reject);
    
    if (Q.allSettled(promises)) {
      console.log('Pruned ' + numPruned + ' Rooms');
      resolve();  
    }
  });
}

module.exports = {
  createNode: _createNode,
  calcRoomScores: _calcRoomScores,
  pruneDeadRooms: _pruneDeadRooms
};