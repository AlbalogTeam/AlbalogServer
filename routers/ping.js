import express from 'express';
const router = new express.Router();

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
module.exports = router;
