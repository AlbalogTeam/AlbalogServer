import express from 'express';
const router = new express.Router();
//middleware
import userAuth from '../middleware/userAuth';
//controller
import shiftController from '../controllers/shiftController';

//create_shift
router.post(
  '/location/:locationId/create',
  userAuth,
  shiftController.create_shift
);

//get all shift
router.get('/employee/:employeeId', userAuth, shiftController.get_shifts);

module.exports = router;
