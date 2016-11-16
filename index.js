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
const config = {
  indexName: `tasks_${env}`,
  applicationID: process.env.ALGOLIA_APP_ID,
  apiKey: process.env.ALGOLIA_API_KEY
};
const validator = new Validator();
const client = algoliasearch(config.applicationID, config.apiKey);
const tasksIndex = client.initIndex(config.indexName);

// Services
const tasksService = require('./app/tasks');

exports.handler = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

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

  tasksService(event, pathParameters, query, done, renderObject, validator,
    tasksIndex);
};
