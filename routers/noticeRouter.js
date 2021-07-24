const express = require('express');

const router = new express.Router();

const noticeController = require('../controllers/noticeController');
const userAuth = require('../middleware/userAuth');



// notice
router.post(
  '/:locationId/notice/create',
  userAuth,
  noticeController.createNotice
);

router.get('/:locationId/notice', userAuth, noticeController.readNotice);

router.get(
  '/:locationId/notice/:_id',
  userAuth,
  noticeController.readOneNotice
);

router.patch(
  '/:locationId/notice/:_id/update',
  userAuth,
  noticeController.updateNotice
);

router.delete(
  '/:locationId/notice/:_id/delete',
  userAuth,
  noticeController.deleteNotice
);

router.post('/notice/search', userAuth, noticeController.searchNotice);

module.exports = router;
