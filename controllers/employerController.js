import Employer from '../models/user/employer';

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

//logout
const logout_employer = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    console.log(req.user.tokens);

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

module.exports = {
  create_employer,
  login_employer,
  get_profile_employer,
  logout_employer,
  kill_all_sessions,
};
