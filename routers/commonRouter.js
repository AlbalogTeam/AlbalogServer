import express from 'express';
import loginController from '../controllers/loginController';

const router = new express.Router();

router.get('/ping', async (req, res) => {
  try {
    res.status(200).send({
      message: 'server is up',
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
      message: 'something went wrong',
    });
  }
});

router.post('/reset', loginController.findPassword);

// send user info
router.get('/reset_password/:tokenId', loginController.sendUserInfo);

// new password
router.patch('/reset_password', loginController.resetPassword);

router.post('/login', loginController.loginUser);
module.exports = router;
