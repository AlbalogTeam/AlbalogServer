import Location from '../models/location/location';

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

    const {locationId, _id} = req.params;
    const { title, content } = req.body;

    const location = await Location.findOne({ _id: locationId, owner: req.owner._id });

    if(!location) {
      res.status(400).send({
        message: "해당 매장 정보를 찾을 수 없습니다."
      })
    }

    const transitions = location.transitions;

    let originalTransition;
    for(let transition of transitions) {
      if(transition._id.toString() === _id) {
        originalTransition = transition;
        transition.title = title;
        transition.content = content;
        break;
      }
    }

    await location.save();

    if (!originalTransition) {
      res.status(500).send({
        message: 'Cannot Update Transition',
      });
    }

    res.status(201).send({
      updatedTransition: originalTransition,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const deleteTransition = async (req, res) => {
  try {

    const {locationId, _id} = req.params;

    const location = await Location.findOne({ _id: locationId, owner: req.owner._id });

    if(!location) {
      res.status(400).send({
        message: "해당 매장 정보를 찾을 수 없습니다."
      })
    }

    const transitions = location.transitions;
    let deletedTransition;


    for(let idx in transitions) {
      const transition = transitions[idx];
      if(transition._id.toString() === _id) {
        deletedTransition = transition;
        transitions.remove(idx);
        break;
      }
    }

    if (!deletedTransition) {
      res.status(500).send({
        message: 'Cannot Delete Notice',
      });
    }

    await location.save();

    res.status(201).send({
      deletedTransition
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

module.exports = {
  create_transition,
  readTransition,
  updateTransition,
  deleteTransition
};
