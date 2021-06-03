import express from 'express';
const router = new express.Router();
import employerController from '../controllers/employerController';
import permit from '../middleware/permit';
import userAuth from "../middleware/userAuth";

router.post('/signup', employerController.create_employer);
router.post('/login', employerController.login_employer);
router.get(
  '/me',
  userAuth( 'owner'),
  employerController.get_profile_employer
);

router.get('/me/locations', userAuth('owner'), employerController.get_all_locations);

router.patch(
  '/me/update',
    userAuth('owner'),
  employerController.update_employer_profile
);

router.post('/logout', userAuth('owner'), employerController.logout_employer);
router.post('/logoutAll', userAuth('owner'), employerController.kill_all_sessions);

module.exports = router;
