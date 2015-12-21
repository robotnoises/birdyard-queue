var Config      = require('./config/Config');
var Auth        = require('./utilities/Auth');
var Monitor     = require('./lib/Monitor');
var Dispatcher  = require('./lib/Dispatcher');
var Queue       = require('./lib/Queue');

Auth(Config.FB_URL, Config.FB_TOKEN).then(function ($firebaseInstance) {
  Dispatcher.start($firebaseInstance, Monitor.paths);
  Queue.start($firebaseInstance);
}).fail(function (error) {
  console.error(error);
});