import express from "express";
import * as noticeController from "../controllers/noticeController.js"
const router = new express.Router();
import userAuth from "../middleware/userAuth.js"

// CRUD

router.post('/create', userAuth, noticeController.createNotice);
router.get('/', noticeController.readNotice);
router.get('/:id', noticeController.readOneNotice);
router.get('/test', noticeController.tmp);
router.patch('/:_id/update', noticeController.updateNotice);
router.delete('/:_id/delete', noticeController.deleteNotice);

module.exports = router;
