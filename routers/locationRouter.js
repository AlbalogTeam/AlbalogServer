const express = require('express');

const router = new express.Router();
// controller
const locationController = require('../controllers/locationController');
// middleware
const userAuth = require('../middleware/userAuth');

// create location
router.post('/', userAuth, locationController.create_location);

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
  locationController.get_all_employees
);

// get employee info
router.get(
  '/:locationId/employees/:employeeId',
  userAuth,
  locationController.get_employee_info
);

router.patch(
  '/:locationId/employees/:employeeId/update',
  userAuth,
  locationController.update_employee_wage_status
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

router.post('/notice/search', userAuth, locationController.searchNotice);

// workManual
router.post(
  '/:locationId/workmanual/create',
  userAuth,
  locationController.createWorkManual
);

// get all work manuals
router.get(
  '/:locationId/workmanual',
  userAuth,
  locationController.readWorkManual
);

router.get(
  '/:locationId/workmanual/:_id',
  userAuth,
  locationController.readOneWorkManual
);

// update workmanual
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
