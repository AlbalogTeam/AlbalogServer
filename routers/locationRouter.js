import express from 'express';
const router = new express.Router();

import * as locationController from '../controllers/locationController';

import userAuth from '../middleware/userAuth';
import checkUserHasLocation from '../middleware/checkUserHasLocation';

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

// notice

router.post(
  '/:locationId/notice/create',
  userAuth,
  // checkUserHasLocation,
  locationController.createNotice
);

router.get(
  '/:locationId/notice',
  userAuth,
  // checkUserHasLocation,
  locationController.readNotice
);

router.get(
  '/:locationId/notice/:_id',
  userAuth,
  // checkUserHasLocation,
  locationController.readOneNotice
);

router.patch(
  '/:locationId/notice/:_id/update',
  userAuth,
  // checkUserHasLocation,
  locationController.updateNotice
);

router.delete(
  '/:locationId/notice/:_id/delete',
  userAuth,
  // checkUserHasLocation,
  locationController.deleteNotice
);

//workManual
router.post(
  '/:locationId/workmanual/:categoryId',
  userAuth,
  checkUserHasLocation,
  locationController.createWorkManual
);

router.get(
  '/:locationId/workmanual',
  userAuth,
  checkUserHasLocation,
  locationController.readWorkManual
);

router.get(
  '/:locationId/workmanual/:_id',
  userAuth,
  checkUserHasLocation,
  locationController.readOneWorkManual
);

router.patch(
  '/:locationId/workmanual/:_id/update',
  userAuth,
  checkUserHasLocation,
  locationController.updateWorkManual
);

router.delete(
  '/:locationId/workmanual/:_id/delete',
  userAuth,
  checkUserHasLocation,
  locationController.deleteWorkManual
);

module.exports = router;
