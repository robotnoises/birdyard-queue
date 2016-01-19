// Monitor.js 
// Define the Firebase paths to monitor and how to monitor them

var Config  = require('./../config/Config');
var Task    = require('./../utilities/Task');

var running = {};

/* Monitored path callbacks */

// Confirm that both node and child node are created successfully 
function originExists ($nodes) {
  
  var nodes = $nodes.val();
  
  for (var key in nodes) {
    var node = nodes[key];
    // If this is a child of another node
    if (node.origin) {
      this.firebase.child(node.origin).once('value', function ($snap) {
        // If the origin node does not exist...
        if (!$snap.exists()) {
          console.log('Origin not found for ', node.origin);
          // Add the Task to the queue
          this.firebase
            .child(Config.TASK_PATH)
            .push(Task.format(Task.TYPE.ORPHANED_NODE, {'origin': node.origin, 'data': node}));  
          }
      });
    } 
  }
}

function calculateScores() {
  
  var $ref = this.firebase.child(Config.TASK_PATH).child(Config.CALC_ROOM_SCORE_KEY);
  
  $ref.once('value', function ($snap) {
    // Add the Task to the queue
    this.firebase
      .child(Config.TASK_PATH)
      .child(Config.CALC_ROOM_SCORE_KEY)
      .set(Task.format(Task.TYPE.CALC_ROOM_SCORES, {})); 
  });
}

function pruneRooms() {
  
  var $ref = this.firebase.child(Config.TASK_PATH).child(Config.PRUNE_ROOMS_KEY);
  
  $ref.once('value', function ($snap) {
    // Add the Task to the queue
    this.firebase
      .child(Config.TASK_PATH)
      .child(Config.PRUNE_ROOMS_KEY)
      .set(Task.format(Task.TYPE.PRUNE_DEAD_ROOMS, {}));
  });
}

/* Firebase paths for the Dispatcher to monitor */

// @location: the firebase path
// @event: the event that triggers an action
// @handler: handler to add an appropriate Task to the queue

var MonitoredPaths = {
  
  // Nodes: validate that node and origin both exists
  'nodes_validate': {
    'location': 'nodes',
    'event': 'value',
    'handler': originExists
  },
  
  // Rooms: calculate score
  'rooms_score': {
    'location': 'rooms/everything',
    'event': 'value',
    'handler': calculateScores
  },
  
  // Rooms: prune dead rooms after scores are calculated
  'rooms_prune': {
    'location': 'rooms/everything',
    'event': 'value',
    'handler': pruneRooms
  }
};

module.exports = {
  paths: MonitoredPaths
}