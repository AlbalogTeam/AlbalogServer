import jwt from 'jsonwebtoken';
import Employer from '../models/user/employer';

const ownerAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //직원이면 직원 로그인페이지로 리다이렉트
    // if(decoded.role === 'staff') return redirect('/staff')

    const user = await Employer.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = ownerAuth;
