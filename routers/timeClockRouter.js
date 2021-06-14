import express from 'express';
const router = new express.Router();

import * as timeClockController from '../controllers/timeClockController';
import userAuth from '../middleware/userAuth';

router.post('/:locationId/start', timeClockController.startWork);

router.post('/:locationId:end', userAuth, timeClockController.endWork);

router.get(
  '/:locationId/staff',
  userAuth,
  timeClockController.readTimeClockForStaff
);

router.get(
  '/:locationId/owner',
  userAuth,
  timeClockController.readTimeClockForOwner
);

router.patch(
  '/:locationId/update/start',
  userAuth,
  timeClockController.updateStartTime
);

router.patch(
  '/:locationId/update/end',
  userAuth,
  timeClockController.updateEndTime
);

router.delete(
  '/:locationId/delete',
  userAuth,
  timeClockController.deleteTimeClock
);

module.exports = router;
