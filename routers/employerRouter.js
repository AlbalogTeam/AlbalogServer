const express = require('express');
const employerController = require('../controllers/employerController');
const userAuth = require('../middleware/userAuth');

const router = new express.Router();

router.post('/check', employerController.check_email);
router.post('/signup', employerController.createEmployer);

router.get('/me', userAuth, employerController.get_profile_employer);

router.get('/me/locations', userAuth, employerController.getAllLocations);

router.patch(
  '/me/update',
  userAuth,
  employerController.update_employer_profile
);

router.post('/logout', userAuth, employerController.logoutEmployer);
router.post('/logoutAll', userAuth, employerController.killAllSession);

module.exports = router;
