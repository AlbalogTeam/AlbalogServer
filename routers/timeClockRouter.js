import express from 'express';
const router = new express.Router();

import * as timeClockController from '../controllers/timeClockController';
import userAuth from '../middleware/userAuth';

router.post(
  '/:locationId/signup',
    timeClockController.create_employee
);

//get employees all locations

router.get('/locations', userAuth, timeClockController.get_employee_locations);

//get employee's single location
router.get('/:locationId', userAuth, timeClockController.get_single_location);

//get employee
router.get('/:employeeId', userAuth, timeClockController.get_employee);

//update employee
router.patch(
  '/:employeeId/update',
  userAuth,
    timeClockController.update_employee
);

//employee login
router.post('/login', userAuth, employeeController.login_employee);

//employee logout
router.post('/logout', userAuth, employeeController.logout_employee);

module.exports = router;
