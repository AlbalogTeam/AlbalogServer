import jwt from 'jsonwebtoken';
import Employer from '../models/user/employer';

const auth = async (req, res, next) => {

    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Employer.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });

        if (!user) {
            throw new Error();
        }

        if(user.role === 'owner' || user.role === 'admin') {
            next();
        }else {
            res.status(401).send({
                message: 'Not Allowed'
            });
        }

    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}

module.exports = auth;
