import express from "express";
import * as workManualController from "../controllers/workManualController.js"

const router = new express.Router();


router.post('/:locationId/create', workManualController.createWorkManual);
router.get('/', workManualController.readWorkManual);
router.get('/:id', workManualController.readOneWorkManual);
router.patch('/:_id/update', workManualController.updateWorkManual);
router.delete('/:_id/delete', workManualController.deleteWorkManual);

module.exports = router;
