const Location = require('../models/location/location');

const checkIfUserBelongsToLocation = (locationId, userId) => {
  return Location.checkIfUserBelongsToLocation(
    locationId,
    userId
  );
};



module.exports = {
  checkIfUserBelongsToLocation
}
