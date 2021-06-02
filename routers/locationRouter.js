import express from 'express';
const router = new express.Router();
import locationController from '../controllers/locationController';
import ownerAuth from '../middleware/ownerAuth';
import checkUsererHasLocation from '../middleware/checkUserHasLocation';
import permit from '../middleware/permit';

//create location
router.post('/', ownerAuth, locationController.create_location);

//get single location
router.get(
  '/:id',
  ownerAuth,
  checkUsererHasLocation,
  locationController.get_location
);

//update location info
router.patch(
  '/:id/update',
  ownerAuth,
  checkUsererHasLocation,
  locationController.update_location
);

module.exports = router;
