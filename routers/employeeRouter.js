import express from 'express';
const router = new express.Router();

import * as employeeController from '../controllers/employeeController';
import userAuth from '../middleware/userAuth';
import sendLocationName from '../middleware/sendLocationName';

/**
 *  @employeeRoute
 *  /api/v1/employee
 * */

// create employee
router.post('/:locationId/signup', employeeController.createEmployee);

// send location name
router.get(
  '/:locationId/:inviteId/signup',
  employeeController.sendLocationName
);

// get employees all locations

router.get('/locations', userAuth, employeeController.getEmployeeAllLocation);

// get employee's single location
router.get(
  '/:locationId',
  userAuth,
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

module.exports = router;
