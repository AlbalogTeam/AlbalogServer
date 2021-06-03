import jwt from 'jsonwebtoken';
import Employer from '../models/user/employer';
import Employee from '../models/user/employee';

export default function (role) {
  return async (req, res, next) => {
    try {

      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      switch (role) {
        case "owner": {
          const employer = await Employer.findOne({
            _id: decoded._id,
            'tokens.token': token,
          });
          if(!employer) {
            throw new Error("Auth Error");
          }
          req.owner = employer;
          req.token = token;
          next();
        }
        break;
        case "staff": {
          const employee = await Employee.findOne({
            _id: decoded._id,
            'tokens.token': token,
          });
          if (!employee) {
            throw new Error();
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
      res.status(401).send({error: 'Please authenticate'});
    }
  };
}

