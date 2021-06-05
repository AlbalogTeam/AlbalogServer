import mongoose from 'mongoose';
import Category from '../models/location/category';

const createCategory = async (req, res) => {

    const {locationId} = req.params;
    const { name } = req.body;

    const category = await Category.find({locationId,name});

    const flag = category.length > 0;
    if(!flag) {
        const newCategory = new Category({locationId,name});
        if(!newCategory) {
            res.status(500).send({
                message: 'Cannot Create Category'
            });
        }
        await newCategory.save();
        res.status(201).send({
            newCategory
        });
    }else {
        res.status(500).send({
            message: 'Already Exist Category'
        });
    }
}

const deleteCategory = async (req, res) => {

    const {locationId, categoryId} = req.params;

    try {
        const category = await Category.findByIdAndDelete({ _id :categoryId});

        if(!category) {
            res.status(500).send({
                message: 'Cannot delete category'
            })
        }

        res.status(201).send({
            deletedCategory: category
        });
    } catch (err) {
        res.status(500).send({
            message: 'Cannot delete category'
        })
    }
}

module.exports = {
    createCategory,
    deleteCategory
}