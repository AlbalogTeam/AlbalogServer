import express from 'express';
import * as employeeController from '../controllers/employeeController';
import userAuth from '../middleware/userAuth';

const router = new express.Router();

/**
 *  @employeeRoute
 *  /api/v1/employee
 * */

// create employee
router.post('/:locationId/signup', employeeController.create_employee);

// send location name
router.get(
  '/:locationId/:inviteId/signup',
  employeeController.sendLocationName
);

// get employees all locations

router.get('/locations', userAuth, employeeController.get_employee_locations);

// get employee's single location
router.get(
  '/:locationId',
  userAuth,
  employeeController.getEmployeeSingleLocation
);

// get employee
router.get('/:employeeId', userAuth, employeeController.get_employee);

// update employee
router.patch(
  '/:employeeId/update',
  userAuth,
  employeeController.updateEmployee
);

// employee logout
router.post('/logout', userAuth, employeeController.logout_employee);

module.exports = router;
