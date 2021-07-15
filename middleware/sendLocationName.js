const Location = require('../models/location/location');

const sendLocationName = async (req, res, next) => {
  const location = await Location.findById(req.params.locationId);
  res.write(location.name);
  next();
};

module.exports = sendLocationName;
