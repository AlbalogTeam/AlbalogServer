import express from "express";
import * as noticeController from "../controllers/noticeController.js"
const router = new express.Router();
import userAuth from "../middleware/userAuth.js"
import ownerAuth from "../middleware/ownerAuth.js"

// CRUD
router.post('/:locationId/create', userAuth, ownerAuth, noticeController.createNotice);
router.get('/', noticeController.readNotice);
router.get('/:id', noticeController.readOneNotice);
router.get('/test', noticeController.tmp);
router.patch('/:_id/update', ownerAuth, noticeController.updateNotice);
router.delete('/:_id/delete', ownerAuth, noticeController.deleteNotice);

module.exports = router;

