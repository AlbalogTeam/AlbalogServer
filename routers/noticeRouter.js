import express from "express";
import * as noticeController from "../controllers/noticeController.js"
const router = new express.Router();
import ownerAuth from "../middleware/userAuth.js"

// CRUD
router.post(
    '/:locationId/create',
    ownerAuth,

    noticeController.createNotice);

router.get(
    '/', ownerAuth,
    noticeController.readNotice);

router.get(
    '/:id',
    ownerAuth,
    noticeController.readOneNotice);

router.get(
    '/test',
    ownerAuth,
    noticeController.tmp);

router.patch(
    '/:_id/update',
    ownerAuth,
    noticeController.updateNotice);

router.delete(
    '/:_id/delete',
    ownerAuth,
    noticeController.deleteNotice);

module.exports = router;

