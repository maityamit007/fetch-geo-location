const express = require('express');
let locationRouter = express.Router();

const { test, saveLocation } = require('../controllers/location.controller.js');

locationRouter.get('/', test);
locationRouter.post('/save-location', saveLocation);

module.exports = { locationRouter };