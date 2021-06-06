import express from 'express';
const router = new express.Router();

import * as categoryController from '../controllers/categoryController';
import userAuth from '../middleware/userAuth';
import checkUserHasLocation from '../middleware/checkUserHasLocation';

//create category
router.post(
  '/:locationId/',
  userAuth,
  checkUserHasLocation,
  categoryController.createCategory
);

// delete category
router.delete(
  '/:locationId/delete/:categoryId',
  userAuth,
  checkUserHasLocation,
  categoryController.deleteCategory
);

module.exports = router;
