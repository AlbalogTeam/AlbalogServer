import Location from '../models/location/location';

//접속하려는 해당 매장과 접속한 오너의 매장이 일치하는지 체크
const checkUserHasLocation = async (req, res, next) => {
  const locId = req.params.id;

  const ownersLocIdsArr = req.owner.stores.map((ids) => ids.location); //locations to array

  const sameId = ownersLocIdsArr.filter((id) => id == locId);

  if (sameId) {
    if (req.owner && ownersLocIdsArr.includes(locId)) {
      req.location = await Location.findOne({
        _id: sameId,
        owner: req.owner._id,
      });

      next();
    } else {
      res.send({ message: '해당 매장의 접속 권한이 없습니다' });
    }
  }
};

module.exports = checkUserHasLocation;
