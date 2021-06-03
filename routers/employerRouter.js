import express from 'express';
const router = new express.Router();
import employerController from '../controllers/employerController';
import ownerAuth from '../middleware/userAuth';
import permit from '../middleware/permit';

router.post('/signup', employerController.create_employer);
router.post('/login', employerController.login_employer);
router.get(
  '/me',
  [ownerAuth, permit('admin', 'owner')],
  employerController.get_profile_employer
);

router.get('/me/locations', ownerAuth, employerController.get_all_locations);

router.patch(
  '/me/update',
  ownerAuth,
  employerController.update_employer_profile
);

router.post('/logout', ownerAuth, employerController.logout_employer);
router.post('/logoutAll', ownerAuth, employerController.kill_all_sessions);

module.exports = router;
