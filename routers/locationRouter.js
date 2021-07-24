const express = require('express');

const router = new express.Router();
// controller
const locationController = require('../controllers/locationController');
// middleware
const userAuth = require('../middleware/userAuth');

// create location
router.post('/', userAuth, locationController.createLocation);

// get single location
router.get('/:locationId', userAuth, locationController.get_location);

// update location info
router.patch(
  '/:locationId/update',
  userAuth,
  locationController.update_location
);
// send location name
router.get('/:locationId/:inviteId/join', locationController.sendLocationName);
// add employee
router.post(
  '/:locationId/:inviteId/join',
  locationController.alreadyExistsEmployee
);
// invite employee
router.post(
  '/:locationId/invite',
  userAuth,
  locationController.invite_employee
);

// get location's employee list
router.get(
  '/:locationId/employees',
  userAuth,
  locationController.getAllEmployees
);

// get employee info
router.get(
  '/:locationId/employees/:employeeId',
  userAuth,
  locationController.getEmployeeInfo
);

router.patch(
  '/:locationId/employees/:employeeId/update',
  userAuth,
  locationController.update_employee_wage_status
);


module.exports = router;
