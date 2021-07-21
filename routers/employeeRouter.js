const express = require('express');
const employeeController = require('../controllers/employeeController');
const userAuth = require('../middleware/userAuth');
const checkIfUserBelongsToLocation = require('../middleware/checkIfUserBelongsToLocation');

const router = new express.Router();

// create employee
router.post('/:locationId/signup', employeeController.createEmployee);

// send location name
router.get(
  '/:locationId/:inviteId/signup',
  employeeController.sendLocationName
);

// get employees all locations
router.get('/locations', userAuth, employeeController.getEmployeeAllLocations);

// get employee's single location
router.get(
  '/:locationId',
  userAuth,
  checkIfUserBelongsToLocation,
  employeeController.getEmployeeSingleLocation
);

// get employee
router.get('/:employeeId', userAuth, employeeController.getEmployeeProfile);

// update employee
router.patch(
  '/:employeeId/update',
  userAuth,
  employeeController.updateEmployee
);

// employee logout
router.post('/logout', userAuth, employeeController.logoutEmployee);

module.exports = router;
