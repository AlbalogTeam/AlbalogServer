import jwt from 'jsonwebtoken';
import Employer from '../models/user/employer';

const ownerAuth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //직원이면 직원 로그인페이지로 리다이렉트
        if(decoded.role === 'owner'){
            next();
        }else {
            res.status(401).send({
                error: "Owner only can use it "
            });
        }

    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = userAuth;
