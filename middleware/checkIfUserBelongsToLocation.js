const Location = require('../models/location/location');

const checkIfUserBelongsToLocation = async (req, res, next) => {
  const { locationId } = req.params;
  const user = req.owner || req.staff;

  if (!user) throw new Error('해당매장에 속해있지않습니다');

  if (user.role === 'owner') {
    const location = await Location.findOne({
      _id: locationId,
      owner: user._id,
    });
    if (!location) throw new Error('관리자의 매장이 아닙니다');
    next();
  } else {
    const location = await Location.findById(locationId).where({
      'employees.employee': user._id,
    });

    if (!location) throw new Error('해당 매장에 속해있지않습니다');
    next();
  }
};

module.exports = checkIfUserBelongsToLocation;
