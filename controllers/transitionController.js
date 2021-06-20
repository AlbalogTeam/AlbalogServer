import Location from '../models/location/location';

const create_transition = async (req, res) => {
  const { locationId, date, description } = req.body;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const transition = {
      date,
      description,
      completed: false,
    };

    location.transitions.push(transition);

    await location.save();

    res.status(201).send(location.transitions);
  } catch (error) {
    res.status(400).send(error);
  }
};

const readTransition = async (req, res) => {
  const { locationId, date } = req.body;
  try {
    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).json({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const transitions = location.transitions;
    const satisfyTransitions = [];

    // transitions.forEach(v => {
    //   if(v.date === date) {
    //     satisfyTransitions.push(v);
    //   }
    // });

    for (let i = 0; i < transitions.length; i++) {
      const transition = transitions[i];
      if (transition.date === date) {
        satisfyTransitions.push(transition);
      }
    }

    res.status(200).send({
      satisfyTransitions,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateTransition = async (req, res) => {
  const { locationId, transitionId, description } = req.body;
  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const transitions = location.transitions;

    let originalTransition;
    for (let transition of transitions) {
      if (transition._id.toString() === transitionId) {
        originalTransition = transition;
        transition.description = description;
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
  const { locationId, transitionId } = req.body;
  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const transitions = location.transitions;
    let deletedTransition;

    for (let idx in transitions) {
      const transition = transitions[idx];
      if (transition._id.toString() === transitionId) {
        deletedTransition = transition;
        transitions.remove(transitions[idx]);
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
      deletedTransition,
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
  deleteTransition,
};
