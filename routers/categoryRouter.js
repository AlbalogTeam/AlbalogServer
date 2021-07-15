const express = require('express');

const router = new express.Router();

const categoryController = require('../controllers/categoryController');
const userAuth = require('../middleware/userAuth');

// create category
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
