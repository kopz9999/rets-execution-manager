var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: 'default' });
AWS.config.update({region: "us-west-2"});
AWS.config.credentials = credentials;

var handler = require('./').handler;
var ctx = require('./test/ctx');
// var event = require('./test/requests/create.json');
// var event = require('./test/requests/list.json');
var event = require('./test/requests/show.json');

handler(event, ctx, function (a, b) {
  console.log(b);
});

