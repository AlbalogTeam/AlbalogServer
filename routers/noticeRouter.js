import express from "express";
import * as noticeController from "../controllers/noticeController.js";
const router = new express.Router();
import userAuth from "../middleware/userAuth.js";
import checkUserHasLocation from "../middleware/checkUserHasLocation.js";
// CRUD

router.post(
    '/:locationId/create',
    userAuth,
    checkUserHasLocation,
    noticeController.createNotice);

router.get(
    '/:locationId',
    userAuth,
    checkUserHasLocation,
    noticeController.readNotice);

router.get(
    '/:locationId/:_id',
    userAuth,
    checkUserHasLocation,
    noticeController.readOneNotice);

router.patch(
    '/:locationId/:_id/update',
    userAuth,
    checkUserHasLocation,
    noticeController.updateNotice);

router.delete(
    '/:locationId/:_id/delete',
    userAuth,
    checkUserHasLocation,
    noticeController.deleteNotice);

module.exports = router;

