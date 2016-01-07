// Todo: get a human-readable category name based on an enum value

function _getName(value) {
  
  var v = parseInt(value, 10);
  var category = '';
      
  switch(v) {
    case 0:
      category = 'everything';
      break;
    case 1:
      category = 'news';
      break;
    case 2:
      category = 'entertainment';
      break;
    case 3:
      category = 'sports';
      break;
    case 4:
      category = 'games';
      break;
    case 5:
      category = 'whatever';
      break;
    default:
      category = 'everything';
  }
      
  return category;
}

module.exports = {
  getName: _getName
};