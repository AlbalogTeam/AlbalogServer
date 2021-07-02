import express from 'express';
const router = new express.Router();

import * as timeClockController from '../controllers/timeClockController';
import userAuth from '../middleware/userAuth';

router.post('/allpass', timeClockController.allPassWork);

router.post('/allpass/random', timeClockController.allPassWorkRandom);

router.post('/start', userAuth, timeClockController.startWork);

router.post('/end', userAuth, timeClockController.endWork);

router.get(
  '/:locationId/staff',
  userAuth,
  timeClockController.readTimeClockForStaff
);

router.post(
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
