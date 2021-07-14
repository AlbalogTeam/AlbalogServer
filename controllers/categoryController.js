const Category = require('../models/location/category');
const Location = require('../models/location/location');

const createCategory = async (req, res) => {
  const { locationId } = req.params;
  const { name } = req.body;

  const category = await Category.findOne({ locationId, name, deleted: false });

  if (!category) {
    const newCategory = new Category({ locationId, name });
    if (!newCategory) {
      res.status(500).send({
        message: 'Cannot Create Category',
      });
    }
    await newCategory.save();

    const categories = await Category.find({ locationId, deleted: false });

    res.status(201).send({
      categories,
    });
  } else {
    res.status(500).send({
      message: 'Already Exist Category',
    });
  }
};

const readCategory = async (req, res) => {
  const { locationId } = req.params;

  try {
    const categories = await Category.find({ locationId, deleted: false });

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId, name, locationId } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { name: name },
      { new: true }
    );

    if (!category) {
      res.status(500).send({
        message: 'Cannot Update category',
      });
    }

    res.status(201).send({
      UpdatedCategory: category,
      category,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteCategory = async (req, res) => {
  const { locationId, categoryId } = req.params;

  try {
    const location = await Location.findById(locationId);

    location.workManuals.forEach((w) => {
      if (w.category_id.toString() === categoryId) {
        w.deleted = true;
      }
    });

    const category = await Category.findOneAndUpdate(
      { _id: categoryId, deleted: false },
      { deleted: true }
    );

    if (!category) {
      throw new Error('Cannot Delete Category');
    }

    await location.save();

    const categories = await Category.find({ locationId, deleted: false });

    res.status(201).send({
      deletedCategory: category,
      categories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString(),
    });
  }
};

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
};
