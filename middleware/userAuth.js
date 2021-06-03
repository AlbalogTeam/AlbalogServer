import jwt from 'jsonwebtoken';
import Employer from '../models/user/employer';
import Employee from '../models/user/employee';

export default function (role) {
  return async (req, res, next) => {
    try {

      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //직원이면 직원 로그인페이지로 리다이렉트
      // if(decoded.role === 'staff') return redirect('/staff')

      switch (role) {
        case "owner": {
          const employer = await Employer.findOne({
            _id: decoded._id,
            'tokens.token': token,
          });
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
        }
        break;
        default: {
          throw new Error('Auth Error');
        }
        break;
      }



      if (!employer) {


        req.staff = employee;
      } else {
        req.owner = employer;
      }

      req.token = token;

      next();
    } catch (err) {
      res.status(401).send({error: 'Please authenticate'});
    }
  };
}

module.exports = userAuth;
