import express from 'express';
const router = new express.Router();

import locationController from '../controllers/locationController';
import userAuth from '../middleware/userAuth';
import checkUsererHasLocation from '../middleware/checkUserHasLocation';

//create location
router.post('/', userAuth('owner'), locationController.create_location);

//get single location
router.get(
  '/:id',
    userAuth('owner' || 'staff'),
  // checkUsererHasLocation,
  locationController.get_location
);

//update location info
router.patch(
  '/:id/update',
    userAuth('owner'),
  // checkUsererHasLocation,
  locationController.update_location
);

//invite employee
router.post('/:id/invite', userAuth('owner'), locationController.invite_employee);

module.exports = router;
