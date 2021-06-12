import express from 'express';
const router = new express.Router();

import * as locationController from '../controllers/locationController';

import userAuth from '../middleware/userAuth';

//create location
router.post('/', userAuth, locationController.create_location);

//get single location
router.get('/:locationId', userAuth);

//update location info
router.patch(
  '/:locationId/update',
  userAuth,
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
  locationController.createNotice
);

router.get('/:locationId/notice', userAuth, locationController.readNotice);

router.get(
  '/:locationId/notice/:_id',
  userAuth,
  locationController.readOneNotice
);

router.patch(
  '/:locationId/notice/:_id/update',
  userAuth,
  locationController.updateNotice
);

router.delete(
  '/:locationId/notice/:_id/delete',
  userAuth,
  locationController.deleteNotice
);

//workManual
router.post(
  '/:locationId/workmanual/:categoryId',
  userAuth,
  locationController.createWorkManual
);

router.get(
  '/:locationId/workmanual/category/:categoryId',
  userAuth,
  locationController.readWorkManual
);

router.get(
  '/:locationId/workmanual/:_id',
  userAuth,
  locationController.readOneWorkManual
);

router.patch(
  '/:locationId/workmanual/:_id/update',
  userAuth,
  locationController.updateWorkManual
);

router.delete(
  '/:locationId/workmanual/:_id/delete',
  userAuth,
  locationController.deleteWorkManual
);

module.exports = router;
