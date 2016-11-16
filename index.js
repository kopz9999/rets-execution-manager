'use strict';

console.log('Loading function');
// Env
var dotenv = require('dotenv');
var env = process.env.NODE_ENV || 'production';
dotenv.config({path: `./${env}.env`});

// Classes
const Validator = require('jsonschema').Validator;
const algoliasearch = require('algoliasearch');

// Objects
const uuid = require('node-uuid');
const config = {
  indexName: `tasks_${env}`,
  applicationID: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY
};
const validator = new Validator();
const HttpStatus = require('http-status-codes');
const tasksSchema = require('./models/task-input.json');
const client = algoliasearch(config.applicationID, config.apiKey);
const tasksIndex = client.initIndex(config.indexName);

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

  var pathParameters = event.pathParameters || {};
  var query = event.queryStringParameters || {};

  switch (event.httpMethod) {
    case 'GET': // TODO: Logic here
      if (pathParameters.id) {
        tasksIndex.getObject(pathParameters.id, done);
      } else {
        tasksIndex.search(query.search,
          { hitsPerPage: query.per_page, page: query.page }, done);
      }
      break;
    case 'POST':
      subject = JSON.parse(event.body);
      var result = validator.validate(subject, tasksSchema);
      if (result.errors.length > 0) {
        done(null, result.errors, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        subject.id = subject.objectID = uuid.v4();
        tasksIndex.saveObject(subject, renderObject(HttpStatus.CREATED, subject));
      }
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
