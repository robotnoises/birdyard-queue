// Monitor.js 
// Define the Firebase paths to monitor and how to monitor them

var Config  = require('./../config/Config');
var Task    = require('./../utilities/Task');

/* Monitored path callbacks */

// Confirm that both node and child node are created successfully 
function originExists ($snap) {
  
  var node = $snap.val();
      
  // If this is a child of another node
  if (node.origin) {
    this.firebase.child(node.origin).once('value', function ($snap) {
      if (!$snap.exists()) {
        console.log('Origin not found for ', node.origin);
        
        var task = Task.format(Task.TYPE.ORPHANED_NODE, {
          'origin': node.origin
        });
        
        this.firebase.child(Config.QUEUE_PATH).push(task);
      }
    });
  }
}

/* Firebase paths for the Dispatcher to monitor */

var MonitoredPaths = {
  
  // Nodes
  'node': {
    'path': 'nodes',
    'event': 'child_added',
    'callback': originExists
  }
};

module.exports = {
  paths: MonitoredPaths
}