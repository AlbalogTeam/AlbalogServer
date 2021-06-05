import Location from '../models/location/location';
import jwt from 'jsonwebtoken';

//접속하려는 해당 매장과 접속한 오너의 매장이 일치하는지 체크
const checkUserHasLocation = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const { locationId } = req.params;

  const judge =
    decoded.stores.filter((loc) => loc.location === locationId).length > 0;

  if (decoded && judge) {
    req.location = await Location.findOne({
      _id: locationId,
    });
    next();
  } else {
    res.send({ message: '해당 매장의 접속 권한이 없습니다' });
  }
};

module.exports = checkUserHasLocation;
