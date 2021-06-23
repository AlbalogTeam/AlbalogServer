import express from 'express';
const router = new express.Router();

import * as categoryController from '../controllers/categoryController';
import userAuth from '../middleware/userAuth';

//create category
router.post('/:locationId/create', userAuth, categoryController.createCategory);

router.get('/:locationId', userAuth, categoryController.readCategory);

router.patch('/update', userAuth, categoryController.updateCategory);


// delete category
router.delete(
  '/:locationId/delete/:categoryId',
  userAuth,
  categoryController.deleteCategory
);

module.exports = router;
