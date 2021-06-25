import Category from '../models/location/category';
import Location from '../models/location/location';
const createCategory = async (req, res) => {
  const { locationId } = req.params;
  const { name } = req.body;

  const category = await Category.find({ locationId, name });

  const flag = category.length > 0;
  if (!flag) {
    const newCategory = new Category({ locationId, name });
    if (!newCategory) {
      res.status(500).send({
        message: 'Cannot Create Category'
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
  const { locationId, categoryId } = req.params;

  try {

    const location = await Location.findById(locationId);

    const judgeExistWorkManual = location.workManuals.filter(w => w.category_id.toString() === categoryId).length;

    let category = undefined;

    if(judgeExistWorkManual) {
      throw new Error("Cannot Remove Category, Because Category have Workmanual");
    }else
      category = await Category.findByIdAndDelete({ _id: categoryId });

      res.status(201).send({
        success: true,
        deletedCategory: category
      });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.toString()
    });
  }
};

module.exports = {
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
};
