import express from 'express';
import employerController from '../controllers/employerController';
import userAuth from '../middleware/userAuth';

const router = new express.Router();

router.post('/check', employerController.checkEmail);
router.post('/signup', employerController.createEmployer);

router.get('/me', userAuth, employerController.getEmployerProfile);

router.get('/me/locations', userAuth, employerController.getAllLocations);

router.patch('/me/update', userAuth, employerController.updateEmployerProfile);

router.post('/logoutAll', userAuth, employerController.killAllSession);

module.exports = router;
