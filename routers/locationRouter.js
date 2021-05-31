import express from 'express';
const router = new express.Router();
import * as locationController from "../controllers/locationController.js"
import userAuth from '../middleware/userAuth';
import permit from '../middleware/permit';

router.post('/create', userAuth, locationController.createLocation);

module.exports = router;
