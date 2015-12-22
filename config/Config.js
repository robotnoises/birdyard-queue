// Global configuration
var Config = {
  'FB_URL': 'https://' + process.env.FB_NAME + '.firebaseio.com',
  'FB_TOKEN': process.env.FB_TOKEN || null,
  'QUEUE_PATH': 'queue',
  'TASK_PATH': 'queue/tasks',
  'CALC_ROOM_SCORE_KEY': 'CALC_ROOM_SCORES'
};

module.exports = Config;