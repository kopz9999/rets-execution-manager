var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.update({region: "us-west-2"});
AWS.config.credentials = credentials;

var handler = require('./').handler;
var ctx = require('./test/ctx');
var createEvent = require('./test/requests/create.json');
var listEvent = require('./test/requests/list.json');
var showEvent = require('./test/requests/show.json');

handler(createEvent, ctx, function (a, b) {
  console.log(b);
});

handler(listEvent, ctx, function (a, b) {
  console.log(b);
});

handler(showEvent, ctx, function (a, b) {
  console.log(b);
});
