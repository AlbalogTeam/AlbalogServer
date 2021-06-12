import express from 'express';
const router = new express.Router();

import * as transitionController from '../controllers/transitionController';
import userAuth from '../middleware/userAuth';

router.post('/:locationId/signup', transitionController.create_employee);

//get employee's all locations
router.get('/locations', userAuth, transitionController.get_employee_locations);

//get employee's single location
router.get('/:locationId', userAuth, transitionController.get_single_location);

//get employee
router.get('/:employeeId', userAuth, transitionController.get_employee);

//update employee
router.patch(
  '/:employeeId/update',
  userAuth,
  transitionController.update_employee
);

//employee login
router.post('/login', userAuth, transitionController.login_employee);

//employee logout
router.post('/logout', userAuth, transitionController.logout_employee);

module.exports = router;
