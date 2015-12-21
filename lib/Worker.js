// Worker.js
// Various methods to process Tasks

var Q = require('q');

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
    
    $ref.set(data);
    
    resolve();
  });
}

module.exports = {
  createNode: _createNode
};