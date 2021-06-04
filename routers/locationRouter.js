import express from 'express';
const router = new express.Router();

import locationController from '../controllers/locationController';
import userAuth from '../middleware/userAuth';
import checkUsererHasLocation from '../middleware/checkUserHasLocation';

//create location
router.post('/', userAuth, locationController.create_location);

//get single location
router.get(
  '/:locationId',
  userAuth,
  // checkUsererHasLocation,
  locationController.get_location
);

//update location info
router.patch(
  '/:locationId/update',
  userAuth,
  // checkUsererHasLocation,
  locationController.update_location
);

//invite employee
router.post(
  '/:locationId/invite',
  userAuth,
  locationController.invite_employee
);

//get location's employee list
router.get(
  '/:locationId/employees',
  userAuth,
  locationController.get_all_employees
);

//get employee info
router.get(
  '/:locationId/employees/:employeeId',
  userAuth,
  locationController.get_employee_info
);

router.patch(
  '/:locationId/employees/:employeeId/wage',
  userAuth,
  locationController.update_employee_wage
);

module.exports = router;
