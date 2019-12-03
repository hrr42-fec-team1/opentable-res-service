const mongoose = require('./connect')
mongoose.Promise = global.Promise;

let mapperSchema = mongoose.Schema({
  restaurant_id: Number,
  latitude: Number,
  longitude: Number
});

let Mapper = mongoose.model('Mapper', mapperSchema);

var getAll = () => {
  return new Promise((resolve, reject) => {
    Mapper.find()
      .exec((err, maps) => {
        resolve(maps);
      });
  });
};

var getOne = (restaurantId) => {
  return new Promise((resolve, reject) => {
    Mapper.find({ restaurant_id: restaurantId })
      .exec((err, map) => {
        resolve(map);
      });
  });
};

module.exports = Mapper;
module.exports.getAll = getAll;
module.exports.getOne = getOne;