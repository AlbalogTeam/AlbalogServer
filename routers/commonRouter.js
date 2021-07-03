import express from 'express';
const router = new express.Router();
import loginController from '../controllers/loginController';

router.get('/ping', async (req, res) => {
  try {
    res.status(200).send({
      message: 'server is up',
    });
  } catch (error) {
    res.status(500).send({
      error: error,
      message: 'something went wrong',
    });
  }
});

router.post('/reset', loginController.find_password);

router.post('/login', loginController.login_user);
module.exports = router;
