import express from 'express';
const router = new express.Router();

import * as employeeController from '../controllers/employeeController';
import userAuth from '../middleware/userAuth';
import sendLocationName from '../middleware/sendLocationName';

/**
 *  @employeeRoute
 *  /api/v1/employee
 * */

//create employee
router.post('/:locationId/signup', employeeController.create_employee);

//send location name
router.get(
  '/:locationId/:inviteId/signup',
  employeeController.send_location_name
);

//get employees all locations

router.get('/locations', userAuth, employeeController.get_employee_locations);

//get employee's single location
router.get('/:locationId', userAuth, employeeController.get_single_location);

//get employee
router.get('/:employeeId', userAuth, employeeController.get_employee);

//update employee
router.patch(
  '/:employeeId/update',
  userAuth,
  employeeController.update_employee
);

//employee login
router.post('/login', employeeController.login_employee);

//employee logout
router.post('/logout', userAuth, employeeController.logout_employee);

module.exports = router;
