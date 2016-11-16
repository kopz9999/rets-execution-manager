'use strict';

const clientsSchema = require('../models/client-input.json');
const HttpStatus = require('http-status-codes');
const uuid = require('node-uuid');

// Tasks endpoint
module.exports = (event, pathParameters, query, done, renderObject, validator,
                  clientsIndex) => {
  let subject = null, result = null, clientId = pathParameters.id;
  switch (event.httpMethod) {
    case 'GET': // TODO: Logic here
      if (clientId) {
        clientsIndex.getObject(clientId, done);
      } else {
        clientsIndex.search(query.search,
          { hitsPerPage: query.per_page, page: query.page }, done);
      }
      break;
    case 'POST':
      subject = JSON.parse(event.body);
      result = validator.validate(subject, clientsSchema);
      if (result.errors.length > 0) {
        done(null, result.errors, HttpStatus.UNPROCESSABLE_ENTITY);
      } else {
        subject.id = subject.objectID = uuid.v4();
        clientsIndex.saveObject(subject, renderObject(HttpStatus.CREATED,
          subject));
      }
      break;
    case 'PUT':
      clientsIndex.getObject(clientId, (err)=> {
        if (err) done(null, null, HttpStatus.NOT_FOUND);
        else {
          subject = JSON.parse(event.body);
          result = validator.validate(subject, clientsSchema);
          if (result.errors.length > 0) {
            done(null, result.errors, HttpStatus.UNPROCESSABLE_ENTITY);
          } else {
            subject.objectID = clientId;
            clientsIndex.partialUpdateObject(subject,
              renderObject(HttpStatus.OK, subject));
          }
        }
      });
      break;
    case 'DELETE': // TODO: Logic here
      clientsIndex.deleteObject(pathParameters.id, done);
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
