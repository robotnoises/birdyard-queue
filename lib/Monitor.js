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
        if (!$snap.exists()) {
          console.log('Origin not found for ', node.origin);
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
    if (!$snap.exists()) {
      this.firebase
        .child(Config.TASK_PATH)
        .child(Config.CALC_ROOM_SCORE_KEY)
        .set(Task.format(Task.TYPE.CALC_ROOM_SCORES, {})); 
    }
  });
}

/* Firebase paths for the Dispatcher to monitor */

var MonitoredPaths = {
  
  // Nodes: validate that node and origin both exists
  'nodes_validate': {
    'path': 'nodes',
    'event': 'value',
    'callback': originExists
  },
  
  // Rooms: calculate score
  'rooms_score': {
    'path': 'rooms/everything',
    'event': 'value',
    'callback': calculateScores
  } 
};

module.exports = {
  paths: MonitoredPaths
}