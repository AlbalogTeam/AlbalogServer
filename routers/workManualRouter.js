const express = require('express');

const router = new express.Router();
// controller
const workManualRouter = require('../controllers/workManualController');
// middleware
const userAuth = require('../middleware/userAuth');


// workManual
router.post(
  '/:locationId/workmanual/create',
  userAuth,
  workManualRouter.createWorkManual
);

// get all work manuals
router.get(
  '/:locationId/workmanual',
  userAuth,
  workManualRouter.readWorkManual
);

router.get(
  '/:locationId/workmanual/:_id',
  userAuth,
  workManualRouter.readOneWorkManual
);

// update workmanual
router.patch(
  '/:locationId/workmanual/:_id/update',
  userAuth,
  workManualRouter.updateWorkManual
);

router.delete(
  '/:locationId/workmanual/:_id/delete',
  userAuth,
  workManualRouter.deleteWorkManual
);

module.exports = router;
