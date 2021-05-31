import express from 'express';
const router = new express.Router();
import locationController from '../controllers/locationController';
import userAuth from '../middleware/userAuth';
import permit from '../middleware/permit';

//create location
router.post('/', userAuth, locationController.create_location);

router.get('/all', userAuth, locationController.get_all_locations);
module.exports = router;
