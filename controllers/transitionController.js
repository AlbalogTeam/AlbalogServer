const Location = require('../models/location/location');
const Employee = require('../models/user/employee');
const Employer = require('../models/user/employer');

const create_transition = async (req, res) => {
  const { locationId, date, description, userId } = req.body;

  let person = undefined;
  person = req.owner
    ? await Employer.findById(userId)
    : await Employee.findById(userId);

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const transition = {
      date,
      description,
      completed: false,
      who_worked: [{ userId: userId, name: person.name, completed: false }],
    };

    location.transitions.push(transition);

    await location.save();

    res.status(201).send({
      transitions: location.transitions.filter((t) => t.date === date),
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const readTransition = async (req, res) => {
  const { locationId, date } = req.params;
  try {
    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).json({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const { transitions } = location;
    const satisfyTransitions = [];

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

const updateDescriptionInTransition = async (req, res) => {
  const { locationId, transitionId, description, userId } = req.body;
  let person = undefined;
  person = req.owner
    ? await Employer.findById(userId)
    : await Employee.findById(userId);

  try {
    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const transitions = location.transitions;

    let originalTransition;
    let updatedTransition;
    for (let transition of transitions) {
      if (transition._id.toString() === transitionId) {
        originalTransition = transition;
        transition.description = description;
        transition.modify_person.push({
          userId: userId,
          name: person.name,
        });
        updatedTransition = transition;
        break;
      }
    }

    const date = originalTransition.date;

    await location.save();

    if (!originalTransition) {
      res.status(500).send({
        message: 'Cannot Update Transition',
      });
    }

    res.status(201).send({
      updatedTransition,
      transitions: location.transitions.filter((t) => t.date === date),
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const toggleComplete = async (req, res) => {
  const { locationId, transitionId, userId } = req.body;
  let person = undefined;
  person = req.owner
    ? await Employer.findById(userId)
    : await Employee.findById(userId);

  try {
    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const transitions = location.transitions;

    let originalTransition;
    let updatedTransition;
    for (let transition of transitions) {
      if (transition._id.toString() === transitionId) {
        originalTransition = transition;
        const employee = {
          userId: userId,
          name: person.name,
          completed:
            !transition.who_worked[transition.who_worked.length - 1].completed,
        };
        transition.completed = employee.completed;
        transition.who_worked.push(employee);
        updatedTransition = transition;
        break;
      }
    }

    await location.save();

    const date = updatedTransition.date;

    if (!originalTransition) {
      res.status(500).send({
        message: 'Cannot Update Transition',
      });
    }

    res.status(200).send({
      updatedTransition: updatedTransition,
      transitions: location.transitions.filter((t) => t.date === date),
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const deleteTransition = async (req, res) => {
  const { locationId, transitionId } = req.params;

  try {
    const location = await Location.findOne({
      _id: locationId,
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

    const date = deletedTransition.date;

    if (!deletedTransition) {
      res.status(500).send({
        message: 'Cannot Delete Notice',
      });
    }

    await location.save();

    res.status(200).send({
      deletedTransition,
      transitions: location.transitions.filter((t) => t.date === date),
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
  updateDescriptionInTransition,
  toggleComplete,
  deleteTransition,
};
