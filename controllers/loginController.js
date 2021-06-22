import Employer from '../models/user/employer';
import Employee from '../models/user/employee';

//login
const login_user = async (req, res) => {
  try {
    let user = await Employer.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      user = await Employee.findByCredentials(
        req.body.email,
        req.body.password
      );
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res
      .status(400)
      .send({ message: 'Unable to login', error: error.toString() });
  }
};

module.exports = { login_user };
