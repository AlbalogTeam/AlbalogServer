import Transition from '../models/transition';
import Location from '../models/location/location';
import mongoose from 'mongoose';


const create_transition = async (req, res) => {
  const locationId = req.params.locationId;
  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }


    const transition = new Transition(req.body);

    if(!transition) {
      res.status(500).send({
        message: 'Cannot Create Transition'
      });
    }

    location.transitions.push(transition);

    await location.save();

    res.status(201).send(location.transitions);

  } catch (error) {
    res.status(400).send(error);
  }
};
const readTransition = async (req, res) => {
  const { locationId } = req.params;
  try {
    const location = await Location.findOne({ _id: locationId, owner: req.owner._id });

    if(!location) {
      res.status(400).send({
        message: "해당 매장 정보를 찾을 수 없습니다."
      })
    }

    const transitions = location.transitions;

    res.status(201).send({
      transitions,
    });

  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};
const updateTransition = async (req, res) => {
  try {

    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const {locationId, _id} = req.params;
    const { title, content } = req.body;

    const location = await Location.findOne({ _id: locationId, owner: req.owner._id });

    if(!location) {
      res.status(400).send({
        message: "해당 매장 정보를 찾을 수 없습니다."
      })
    }

    const notices = location.notices;
    let originNotice;
    for(let notice of notices) {
      if(notice._id.toString() === _id) {
        notice.title = title;
        notice.content = content;
        originNotice = notice;
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
      updatedNotice: originNotice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

module.exports = {
  create_employee,
  login_employee,
  logout_employee,
  get_employee,
  get_employee_locations,
  get_single_location,
  update_employee,
};
