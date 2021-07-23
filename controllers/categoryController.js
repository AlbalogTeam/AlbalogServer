const Category = require("../models/location/category");
const categoryService = require("../service/categoryService");


const createCategory = async (req, res) => {

  const { locationId } = req.params;
  const { name } = req.body;

  const category = await categoryService.findNotDeletedCategory(locationId, 1, name);

  if (!category.length) {

    await categoryService.createCategory(locationId, name);
    const allCategoryList = await categoryService.findNotDeletedCategory(locationId, 0);

    res.status(201).send({
      categories: allCategoryList
    });
  } else {
    res.status(500).send({
      message: "Already Exist Category"
    });
  }
};

const readCategory = async (req, res) => {
  const { locationId } = req.params;

  try {
    const allCategoryList = await categoryService.findNotDeletedCategory(locationId, 0);

    res.status(200).send({
      categories: allCategoryList
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString()
    });
  }
};

const updateCategory = async (req, res) => {

  const { categoryId, name, locationId } = req.body;

  try {
    const category = await categoryService.updateCategoryName(locationId, categoryId, name);

    // TODO 업데이트 된 애를 보낼것인지, 아니면 카테고리 전체목록을 보낼것인지, 아니면 둘다 보낼것인지
    res.status(201).send({
      UpdatedCategory: category,
      category
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};


const deleteCategory = async (req, res) => {

  const { locationId, categoryId } = req.params;

  try {

    await categoryService.removeWorkManualIfCategoryDeleted(locationId, categoryId);

    const deletedCategory = await categoryService.deleteCategory(locationId, categoryId);

    if (!deletedCategory) {
      throw new Error("Cannot Delete Category");
    }

    const allCategoryList = await Category.find({ locationId, deleted: false });

    res.status(201).send({
      deletedCategory,
      categories: allCategoryList
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
  deleteCategory
};
