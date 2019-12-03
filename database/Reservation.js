const mongoose = require('./connect.js');
mongoose.Promise = global.Promise;

let reservationSchema = mongoose.Schema({
  restaurant_id: Number,
  customer_name: String,
  reservation_time: Date,
  guests: Number,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

let Reservation = mongoose.model('Reservation', reservationSchema);

var getAll = () => {
  return new Promise((resolve, reject) => {
    Reservation.find()
      .exec((err, reservations) => {
        resolve(reservations);
      });
  });
};

var getByDate = (restId, date) => {
  return new Promise((resolve, reject) => {  // this won't work
    Reservation.find({ restaurant_id: restId }).where('reservation_time').eq(date)
      .exec((err, reservations) => {
        resolve(reservations);
      });
  });
};

// function to make a reservation.  or not.
var make = (restId, name, time) => {
  //  1. get all reservations for this restaurant, date.  Not very efficient.
  //  2. pare down to overlapping dateTimes
  //  3. check if <name> has an overlapping dateTime.  If so, decline
  //  4. if count of existing reservation dateTime overlaps (array created in step 2) is already at
  //       max, decline the new reservation
  //  5. else, add the reservation to the database!
  getByDate(name, time)
  .then((reservations) => {
    const AVAIL_TABLES = 15;
    var nameMatch = false;
    var overlaps = [];
    var currResStart = time;
    var currResEnd = new Date(currResStart);
    //  a reservation is two hours long
    currResEnd.setHours(currResEnd.getHours() + 2);
    //  a real restaurant would check that start AND end are within open hours
    for (var i = 0; i < reservations.length; i++) {
      var exResStart = reservations[i].reservation_time;
      var exResEnd = new Date(exResStart);
      //  every reservation is for two hours
      exResEnd.setHours(exResEnd.getHours() + 2);
      //  overlap = new reservation start OR end is between existing reservation start AND end
      if ((currResStart > exResStart && currResStart < exResEnd) ||
          (currResEnd > exResStart && currResEnd < exResEnd)) {
        overlaps.push(reservations[i]);
        //  HEY!  Does the name match?  If so, decline reservation.
        if (name !== '' && name === reservations[i].name) {
          nameMatch = true;
          break;
        }
      }
    }
    if (nameMatch || overlaps.length >= AVAIL_TABLES) {
      //  return declined reason
    } else {
      //  add to the database
    }
  })
  .catch((err) => {
    //console.log('Error:', err);
    //res.end();
  });
};

module.exports = Reservation;
module.exports.getAll = getAll;
module.exports.make = make;
