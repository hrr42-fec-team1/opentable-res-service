const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reservations');

module.exports = mongoose;