import express from "express";
import * as workManualController from "../controllers/workManualController.js"
import userAuth from '../middleware/userAuth.js';
import checkUserHasLocation from '../middleware/checkUserHasLocation.js';
const router = new express.Router();


router.post(
    '/:locationId/create',
    userAuth,
    checkUserHasLocation,
    workManualController.createWorkManual);

router.get(
    '/:locationId',
    userAuth,
    checkUserHasLocation,
    workManualController.readWorkManual);
router.get(
    '/:locationId/:_id',
    userAuth,
    checkUserHasLocation,
    workManualController.readOneWorkManual);
router.patch(
    '/:locationId/:_id/update',
    userAuth,
    checkUserHasLocation,
    workManualController.updateWorkManual);
router.delete(
    '/:locationId/:_id/delete',
    userAuth,
    checkUserHasLocation,
    workManualController.deleteWorkManual);

module.exports = router;
