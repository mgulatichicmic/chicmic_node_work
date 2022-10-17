'use strict';

const SERVICES = require('../services');
const Joi = require('@hapi/joi');

const { MESSAGES, ERROR_TYPES, AVAILABLE_AUTHS } = require('./constants');
const HELPERS = require('../helpers');
const multer = require('multer');
const uploadMiddleware = multer();

let routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.route = async (app, routes = []) => {
  routes.forEach(route => {
    let middlewares = [];
    if (route.joiSchema.formData) {
      const multerMiddleware = getMulterMiddleware(route.joiSchema.formData);
      middlewares = [multerMiddleware];
    }
    if (route.auth === AVAILABLE_AUTHS.USER) {
      middlewares.push(SERVICES.authService.userValidate());
    };
    app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
  });
};


/**
 *  middleware to  to handle the multipart/form-data
 * @param {*} formData
 */
 let getMulterMiddleware = (formData) => {
  // for single file
  if (formData && Object.keys(formData).length) {
    const fileField = Object.keys(formData)[0];
    return uploadMiddleware.single(fileField);
  }
};

/**
 * middleware
 * @param {*} handler 
 */
let getHandlerMethod = (route) => {
  let handler = route.handler
  return (request, response) => {
    let payload = {
      ...((request.body || {}).value || {}),
      ...((request.params || {}).value || {}),
      ...((request.query || {}).value || {}),
      file: request.file || {},
      user: (request.user ? request.user : {})
    };
    //request handler/controller
    if (route.getExactRequest) {
      request.payload = payload;
      payload = request
    }
    handler(payload)
      .then((result) => {
        response.status(result.statusCode).json(result);
      })
      .catch((err) => {
        console.log('Error is ', err);
        if (!err.statusCode && !err.status) {
          err = HELPERS.responseHelper.createErrorResponse(MESSAGES.SOMETHING_WENT_WRONG, ERROR_TYPES.INTERNAL_SERVER_ERROR);
        }
        response.status(err.statusCode).json(err);
      });
  };
};

module.exports = routeUtils;
