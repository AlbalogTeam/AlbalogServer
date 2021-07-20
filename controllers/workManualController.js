const Location = require('../models/location/location');
const Category = require('../models/location/category');
const mongoose = require('mongoose');


// workManual

const createWorkManual = async (req, res) => {
  const { locationId } = req.params;
  const { title, content, category } = req.body;

  const existCategory = await Category.findOne({ _id: category, locationId });

  if (!existCategory)
    return res.status(400).send('카테고리 id 혹은 정보가가 잘못되었습니다');

  const categoryId = mongoose.Types.ObjectId(category);

  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(500).send({
        message: 'Cannot Find Category',
      });
    }

    const workManual = {
      title,
      content,
      category_id: categoryId,
    };

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    location.workManuals.push(workManual);

    await location.save();

    res.status(201).send({
      workManuals: location.workManuals,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readWorkManual = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await Location.findById({
      _id: locationId,
    }).populate('workManuals.category_id');
    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const manualObject = {
      location: location.name,
      workManuals: location.workManuals.filter((v) => v.deleted === false),
    };

    res.status(200).send(manualObject);
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

const readOneWorkManual = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
      return;
    }

    const workManual = location.workManuals.filter(
      (w) => w._id.toString() === req.params._id && w.deleted === false
    );
    if (!workManual) {
      res.status(500).send({
        message: 'Cannot find One Manual',
      });
    }
    res.status(201).send({
      workManual,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// 카테고리 수정하는것 추가해야함, 추가논의후 결정
const updateWorkManual = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('You are not owner');
    }

    const { locationId, _id } = req.params;
    const { title, content, category } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }
    const workManuals = location.workManuals;
    let originManual;
    for (let workManual of workManuals) {
      if (workManual._id.toString() === _id && !workManual.deleted) {
        workManual.title = title;
        workManual.content = content;
        workManual.category_id = category;
        originManual = workManual;
        break;
      }
    }

    await location.save();

    if (!originManual) {
      res.status(500).send({
        message: 'Cannot Update Manual',
      });
    }

    res.status(201).send({
      updatedWorkManual: location.workManuals,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

const deleteWorkManual = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('You are not owner');
    }

    const { locationId, _id } = req.params;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const workManuals = location.workManuals;
    let deletedWorkManual;

    for (const idx in workManuals) {
      const workManual = workManuals[idx];
      if (workManual._id.toString() === _id) {
        workManual.deleted = true;
        deletedWorkManual = workManual;
        break;
      }
    }

    if (!deletedWorkManual) {
      res.status(500).send({
        message: 'Cannot Delete Manual',
      });
    }

    await location.save();

    res.status(201).send({
      deletedWorkManual: location.workManuals,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

module.exports = {
  // workManual
  createWorkManual,
  readWorkManual,
  readOneWorkManual,
  updateWorkManual,
  deleteWorkManual,
}