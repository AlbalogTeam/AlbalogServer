import Notice from '../models/location/notice.js';
import Location from '../models/location/location.js';
import Board from '../models/location/board.js';

const createNotice = async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await Location.findById({ _id: locationId });

    const boardId = location.board;

    const notice = new Notice({
      ...req.body,
      owner: req.owner._id,
    });

    const board = await Board.findById({ _id: boardId });

    if (!notice) {
      res.status(500).send({
        message: 'Cannot create Notice',
      });
    }

    await notice.save();

    board.notices.push(notice);
    await board.save();
    res.status(201).send({
      message: 'Create notice Successfully',
    });
  } catch (err) {
    console.log('Cannot create Notice');
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readNotice = async (req, res) => {
  const { locationId } = req.params;
  try {
    const location = await Location.findById({ _id: locationId });
    const board = await Board.findById({ _id: location.board });
    const notices = board.notices;
    console.log(notices);

    // 어떤 매장을 기준으로 해야하는지
    const notice = [];
    /*        notices.map((n) => {
                Notice.findById({ _id: n._id} )
                    .then((data) => {
                        notice.push(data);
                        console.log(notice);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
        });*/

    for (let i = 0; i < notices.length; i++) {
      const tmp = await Notice.findById({ _id: notices[i]._id });
      if (!tmp) {
        res.status(500).send({
          message: 'Cannot read Notice',
        });
      }
      notice.push(tmp);
    }

    res.status(201).send({
      notice,
    });
  } catch (err) {
    console.log('Cannot create Notice');
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readOneNotice = async (req, res) => {
  try {
    console.log(req.params);
    const _id = req.params._id;
    console.log(_id);
    const notice = await Notice.findById({ _id });
    if (!notice) {
      res.status(500).send({
        message: 'Cannot find One Notice',
      });
    }
    res.status(201).send({
      notice,
    });
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

    const { _id } = req.params;
    const { title, content } = req.body;

    const notice = await Notice.findByIdAndUpdate(
      { _id },
      {
        title,
        content,
      }
    );

    if (!notice) {
      res.status(500).send({
        message: 'Cannot Update Notice',
      });
    }

    res.status(201).send({
      updatedNotice: notice,
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

    const { _id } = req.params;

    const notice = await Notice.findByIdAndDelete({ _id });

    if (!notice) {
      res.status(500).send({
        message: 'Cannot Delete Notice',
      });
    }

    res.status(201).send({
      deletedNotice: notice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

module.exports = {
  deleteNotice,
  updateNotice,
  readOneNotice,
  readNotice,
  createNotice,
};
