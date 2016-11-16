'use strict';

const tasksSchema = require('../models/task-input.json');
const HttpStatus = require('http-status-codes');
const uuid = require('node-uuid');

// Tasks endpoint
module.exports = (event, pathParameters, query, done, renderObject, validator,
                  tasksIndex) => {
  let subject = null;
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
