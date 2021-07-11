import Employer from '../models/user/employer';
import Location from '../models/location/location';

// email validation
const checkEmail = async (req, res) => {
  try {
    const checkValidEmail = await Employer.checkIfEmailExist(req.body.email);
    if (checkValidEmail)
      return res.status(400).send({ message: 'Email is already taken' });
    res.status(200).send({ message: 'Email is valid' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// create
const createEmployer = async (req, res) => {
  const employer = new Employer(req.body);
  try {
    const checkValidEmail = await Employer.checkIfEmailExist(employer.email);

    if (checkValidEmail) {
      return res.status(400).send({ message: 'Email is already taken' }); // check if user's email already exist
    }
    await employer.save();
    const token = await employer.generateAuthToken();
    res.status(201).send({ employer, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// get profile
const getEmployerProfile = async (req, res) => {
  if (!req.owner) return res.status(400).send('권한이 없습니다');
  res.send(req.owner);
};

// update profile
const updateEmployerProfile = async (req, res) => {
  const { name, password, newPassword } = req.body;

  if (!req.owner) return res.status(400).send('권한이 없습니다');

  try {
    const isMatch = await req.owner.comparePasswords(password);
    if (!isMatch)
      return res.status(400).send({ message: '현재 비밀번호가 다릅니다' });

    if (newPassword === '' || !newPassword || newPassword.length < 1)
      req.owner.password = password;

    req.owner.name = name;
    req.owner.password = newPassword;

    await req.owner.save();
    res.send(req.owner);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

// kill all session
const killAllSession = async (req, res) => {
  try {
    req.owner.tokens = [];
    await req.owner.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const getAllLocations = async (req, res) => {
  if (!req.owner) return res.status(400).send('권한이 없습니다');
  const locIds = req.owner.stores.map((ids) => ids.location); // get all objectIds from user.stores into arrays

  if (locIds.length < 1) {
    return res.status(400).send({
      message: '매장이 없습니다.',
    });
  }

  try {
    const locations = await Location.find({
      _id: { $in: locIds },
    });
    res.send({ locations });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

module.exports = {
  checkEmail,
  createEmployer,
  getEmployerProfile,
  updateEmployerProfile,
  getAllLocations,
  killAllSession,
};
