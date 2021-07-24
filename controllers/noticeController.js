const Location = require('../models/location/location');

const createNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }
    const { locationId } = req.params;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    const { title, content } = req.body;

    const notice = { title, content };

    if (!notice) {
      res.status(500).send({
        message: 'Cannot create Notice',
      });
    }

    location.notices.push(notice);

    await location.save();

    res.status(201).send({
      notices: location.notices,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readNotice = async (req, res) => {
  const { locationId } = req.params;
  try {
    const location = await Location.findOne({
      _id: locationId,
    });
    const notices = location.notices.sort((a, b) => -1);

    res.status(200).send({
      notices,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readOneNotice = async (req, res) => {
  try {
    const { locationId, _id } = req.params;

    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const notice = location.notices.filter((n) => n._id.toString() === _id);

    if (!notice) {
      res.status(500).send({
        message: 'Cannot find One Notice',
      });
    }
    res.status(200).send({ notice });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, _id } = req.params;
    const { title, content } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const notices = location.notices;
    let originNotice;
    for (let notice of notices) {
      if (notice._id.toString() === _id) {
        originNotice = notice;
        notice.title = title;
        notice.content = content;
        break;
      }
    }

    await location.save();

    if (!originNotice) {
      res.status(500).send({
        message: 'Cannot Update Notice',
      });
    }

    res.status(201).send({
      updatedNotice: location.notices,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
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

    const notices = location.notices;
    let deletedNotice;

    for (const idx in notices) {
      const notice = notices[idx];
      if (notice._id.toString() === _id) {
        deletedNotice = notice;
        notice.remove(idx);
        break;
      }
    }

    if (!deletedNotice) {
      res.status(500).send({
        deletedNotice: location.notices,
      });
    }

    await location.save();

    res.status(201).send({
      deletedNotice: deletedNotice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const searchNotice = async (req, res) => {
  try {
    const { locationId, content } = req.body;

    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const findByContent = location.notices.map((n) => {
      if (n.content.indexOf(content) >= 0) return n;
    });
    const findByTitle = location.notices.map((n) => {
      if (n.title.indexOf(content) >= 0) return n;
    });

    const finalNotices = [...findByContent, ...findByTitle].filter(
      (n) => n != null
    );
    const deleteDuplicate = [...new Set(finalNotices)];

    if (finalNotices.length < 1) {
      res.status(200).send([]);
    }
    res.status(200).send(deleteDuplicate);
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

module.exports = {
  // notice
  deleteNotice,
  updateNotice,
  readOneNotice,
  readNotice,
  createNotice,
  searchNotice,
}