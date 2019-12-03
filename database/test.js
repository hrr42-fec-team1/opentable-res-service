const faker = require('faker');

var date = new Date();
var fDate = new Date();
fDate.setDate(fDate.getDate() + 2);  // up to 2 days
console.log(date, fDate);
console.log(faker.date.future(date, fDate));