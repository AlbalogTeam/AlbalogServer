import express from 'express';
const router = new express.Router();

import * as transitionController from '../controllers/transitionController';
import userAuth from '../middleware/userAuth';

router.post('/create', userAuth, transitionController.create_transition);

router.get('/:locationId/:date', userAuth, transitionController.readTransition);

router.patch('/desc/update', userAuth, transitionController.updateTransition);

router.delete('/delete', userAuth, transitionController.deleteTransition);

module.exports = router;
