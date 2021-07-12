import express from 'express';
import userAuth from '../middleware/userAuth';
import shiftController from '../controllers/shiftController';

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

// delete
router.delete(
  '/location/:locationId/delete',
  userAuth,
  shiftController.deleteSchedule
);

module.exports = router;
