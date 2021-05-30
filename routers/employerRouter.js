import express from 'express';
const router = new express.Router();
import employerController from '../controllers/employerController';
import userAuth from '../middleware/userAuth';

router.post('/signup', employerController.create_employer);
router.post('/login', employerController.login_employer);
router.get('/users/me', userAuth, employerController.get_profile_employer);
router.post('/users/logout', userAuth, employerController.logout_employer);
router.post('/users/logoutAll', userAuth, employerController.kill_all_sessions);

module.exports = router;
