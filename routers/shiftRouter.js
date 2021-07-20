const express = require('express');
const userAuth = require('../middleware/userAuth');
const shiftController = require('../controllers/shiftController');

const router = new express.Router();

// create_shift
router.post(
  '/location/:locationId/create',
  userAuth,
  shiftController.createShift
);

// get 1 employee shift
router.get('/employee/:employeeId', userAuth, shiftController.getShifts);

// get all shifts for current location
router.get('/location/:locationId', userAuth, shiftController.getAllShifts);

// get daily shifts
router.get(
  '/location/:locationId/daily/:date',
  userAuth,
  shiftController.getDailySchedule
);

router.delete(
  '/:shiftId/location/:locationId/employee/:employeeId/delete',
  userAuth,
  shiftController.deleteSchedule
);

// delete all shifts
router.delete(
  '/location/:locationId/employee/:employeeId/deleteAll',
  userAuth,
  shiftController.deleteAllSchedule
);

module.exports = router;
