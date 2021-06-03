import express from "express";
import * as noticeController from "../controllers/noticeController.js"
const router = new express.Router();
import userAuth from "../middleware/userAuth.js"

// CRUD
router.post(
    '/:locationId/create',
    userAuth('owner'),
    noticeController.createNotice);

router.get(
    '/',
    userAuth('staff' || 'owner'),
    noticeController.readNotice);

router.get(
    '/:id',
    userAuth('staff' || 'owner'),
    noticeController.readOneNotice);

router.patch(
    '/:_id/update',
    userAuth('owner'),
    noticeController.updateNotice);

router.delete(
    '/:_id/delete',
    userAuth('owner'),
    noticeController.deleteNotice);

module.exports = router;

