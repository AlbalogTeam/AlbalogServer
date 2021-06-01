import Employer from '../models/user/employer';
import Location from '../models/location/location';

//create
const create_employer = async (req, res) => {
  const employer = new Employer(req.body);
  try {
    const checkEmail = await Employer.checkIfEmailExist(employer.email);

    if (checkEmail) {
      return res.status(400).send({ message: 'Email is already taken' }); //check if user's email already exist
    } else {
      await employer.save();
      const token = await employer.generateAuthToken();
      res.status(201).send({ employer, token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

//login
const login_employer = async (req, res) => {
  try {
    const employer = await Employer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await employer.generateAuthToken();

    res.send({ employer, token });
  } catch (error) {
    res.status(400).send('Unable to login');
  }
};

//get profile
const get_profile_employer = async (req, res) => {
  res.send(req.user);
};

//update profile
const update_employer_profile = async (req, res) => {
  const employer = req.body;
  const updates = Object.keys(employer);
  const allowedUpdates = ['name', 'email', 'password'];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdates) {
    return res.status(400).send({
      message: 'invalid update',
    });
  }
  try {
    updates.forEach((update) => (req.user[update] = employer[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

//logout
const logout_employer = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

//kill all session
const kill_all_sessions = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const get_all_locations = async (req, res) => {
  console.log('locations');
  const locIds = req.user.stores.map((ids) => ids.location); //get all objectIds from user.stores into arrays

  const locations = await Location.find({
    _id: { $in: locIds },
  });
  res.send({ locations });
};

module.exports = {
  create_employer,
  login_employer,
  get_profile_employer,
  update_employer_profile,
  get_all_locations,
  logout_employer,
  kill_all_sessions,
};
