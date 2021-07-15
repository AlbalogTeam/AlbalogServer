const express = require('express');
const router = new express.Router();

const transitionController = require('../controllers/transitionController');
const userAuth = require('../middleware/userAuth');

router.post('/create', userAuth, transitionController.create_transition);

router.get('/:locationId/:date', userAuth, transitionController.readTransition);

router.patch(
  '/desc/update',
  userAuth,
  transitionController.updateDescriptionInTransition
);

router.patch('/toggle', userAuth, transitionController.toggleComplete);

router.delete(
  '/:locationId/delete/:transitionId',
  userAuth,
  transitionController.deleteTransition
);

module.exports = router;
