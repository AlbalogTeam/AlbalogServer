import Location from '../models/location/location';

//접속하려는 해당 매장과 접속한 오너의 매장이 일치하는지 체크
const checkOwnerHasLocation = (req, res, next) => {
  const locId = req.params.id;
  const ownersLocIdsArr = req.user.stores.map((ids) => ids.location); //locations to array

  req.user && ownersLocIdsArr.includes(locId)
    ? next()
    : res.send({ message: '해당 매장의 관리자에게만 접속 권한이있습니다' });
};

module.exports = checkOwnerHasLocation;
