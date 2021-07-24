const Category = require("../models/location/category");
const Location = require("../models/location/location");
const findNotDeletedCategory = (locationId, limit, name = "") => {

  return Category.find(
    {
      locationId,
      name: {
        $regex: `.*${name}.*`
      },
      deleted: false
    }).limit(limit);

};

const createCategory = async (locationId, name) => {
  const newCategory = new Category({ locationId, name });
  await newCategory.save();
};

const updateCategoryName = async (locationId, categoryId, name) => {
  return Category.findOneAndUpdate(
    {
      _id: categoryId,
      locationId,
      deleted: false
    },
    { name },
    { new: true }
  );
};

const deleteCategory = async (locationId, categoryId) => {
  return Category.findOneAndUpdate(
    {
      _id: categoryId,
      locationId,
      deleted: false
    },
    { deleted: true },
    { new: true }
  );
};

const removeWorkManualIfCategoryDeleted = (locationId, categoryId) => {
  return Location.updateMany({
      _id: locationId,
      "workManuals.category_id": categoryId
    },
    {
      "$set": {
        "workManuals.$[elem].deleted": true
      }
    },
    {
      arrayFilters: [{ "elem.category_id": categoryId }]
    });
};

module.exports = {
  findNotDeletedCategory,
  createCategory,
  updateCategoryName,
  deleteCategory,
  removeWorkManualIfCategoryDeleted
};