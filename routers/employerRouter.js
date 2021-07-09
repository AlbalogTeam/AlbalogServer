import express from 'express';
const router = new express.Router();
import employerController from '../controllers/employerController';
import userAuth from '../middleware/userAuth';

router.post('/check', employerController.check_email);
router.post('/signup', employerController.create_employer);
router.post('/login', employerController.login_employer);
router.get('/me', userAuth, employerController.get_profile_employer);

router.get('/me/locations', userAuth, employerController.get_all_locations);

router.patch(
  '/me/update',
  userAuth,
  employerController.update_employer_profile
);

router.post('/logout', userAuth, employerController.logout_employer);
router.post('/logoutAll', userAuth, employerController.kill_all_sessions);

module.exports = router;
