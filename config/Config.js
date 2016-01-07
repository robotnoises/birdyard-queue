// Global configuration
var Config = {
  'FB_URL': 'https://' + process.env.FB_NAME + '.firebaseio.com',
  'FB_TOKEN': process.env.FB_TOKEN || null,
  'ROOM_SCORE_THRESHOLD': 0,
  'QUEUE_PATH': 'queue',
  'TASK_PATH': 'queue/tasks',
  'CALC_ROOM_SCORE_KEY': 'CALC_ROOM_SCORES',
  'PRUNE_ROOMS_KEY': 'PRUNE_ROOMS'
};

module.exports = Config;