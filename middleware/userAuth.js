const jwt = require('jsonwebtoken');
const Employer = require('../models/user/employer');
const Employee = require('../models/user/employee');

const userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);



    switch (decoded.role) {
      case 'owner':
        {
          const employer = await Employer.findOne({
            _id: decoded._id,
            'tokens.token': token,
          });
          if (!employer) {
            throw new Error('Please authenticate');
          }
          req.owner = employer;
          req.token = token;
          next();
        }
        break;
      case 'staff':
        {
          const employee = await Employee.findOne({
            _id: decoded._id,
            'tokens.token': token,
          });

          if (!employee) {
            throw new Error('Please authenticate');
          }
          req.staff = employee;
          req.token = token;
          next();
        }
        break;
      default:
        throw new Error('Auth Error');
    }
  } catch (err) {
    res.status(401).send({ success: false, error: err.message });
  }
};

module.exports = userAuth;
