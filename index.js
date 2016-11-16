'use strict';

console.log('Loading function');

// Classes
const doc = require('dynamodb-doc');
const Validator = require('jsonschema').Validator;

// Objects
const uuid = require('node-uuid');
const dynamo = new doc.DynamoDB();
const config = {
  tableName: 'RetsTasks'
};
const validator = new Validator();
const HttpStatus = require('http-status-codes');
const schema = require('./models/task-input.json');

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  let subject = null;

  const done = (err, res, status) => {
    return callback(null, {
      statusCode: status ? status : (err ? '400' : '200'),
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  };

  const renderObject = (status, obj)=> {
    return (err, res, callbackStatus) => {
      if (err) done(err, res, callbackStatus);
      else done(null, obj, status);
    };
  };

  var dynamoParams = { TableName: config.tableName };

  switch (event.httpMethod) {
    case 'GET': // TODO: Logic here

      dynamo.scan(dynamoParams, done);
      break;
    case 'POST':
      // debugger;
      subject = JSON.parse(event.body);
      var result = validator.validate(subject, schema);
      if (result.errors.length > 0) {
        done(null, result.errors, '422');
      } else {
        subject.id = uuid.v4();
        dynamo.putItem(Object.assign({Item: subject}, dynamoParams),
          renderObject(HttpStatus.ACCEPTED, subject));
      }
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
