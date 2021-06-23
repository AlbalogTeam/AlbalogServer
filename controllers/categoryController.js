import Category from '../models/location/category';

const createCategory = async (req, res) => {
  const { locationId } = req.params;
  const { name } = req.body;

  const category = await Category.find({ locationId, name });

  const flag = category.length > 0;
  if (!flag) {
    const newCategory = new Category({ locationId, name });
    if (!newCategory) {
      res.status(500).send({
        message: 'Cannot Create Category',
      });
    }
    await newCategory.save();
    res.status(201).send({
      newCategory,
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
    const categories = await Category.find({ locationId });

    res.status(200).send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateCategory = async (req, res) => {
  const { categoryId, name } = req.body;

  try {
    const category = await Category.findByIdAndUpdate({ _id: categoryId }, {name: name});

    if (!category) {
      res.status(500).send({
        message: 'Cannot Update category',
      });
    }

    res.status(201).send({
      UpdatedCategory: category,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Cannot Update category',
    });
  }
};

const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByIdAndDelete({ _id: categoryId });

    if (!category) {
      res.status(500).send({
        message: 'Cannot delete category',
      });
    }

    res.status(201).send({
      deletedCategory: category,
    });
  } catch (err) {
    res.status(500).send({
      message: 'Cannot delete category',
    });
  }
};

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
};
