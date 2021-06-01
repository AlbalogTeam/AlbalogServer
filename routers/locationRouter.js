import express from 'express';
const router = new express.Router();
import locationController from '../controllers/locationController';
import ownerAuth from '../middleware/ownerAuth';
import checkOwnerHasLocation from '../middleware/checkOwnerHasLocation';
import permit from '../middleware/permit';

//create location
router.post('/', ownerAuth, locationController.create_location);

//get single location
router.get(
  '/:id',
  ownerAuth,
  checkOwnerHasLocation,
  locationController.get_location
);

module.exports = router;
