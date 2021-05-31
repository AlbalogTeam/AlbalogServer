import Location from '../models/location/location';

const create_location = async (req, res) => {
  const location = new Location(req.body);

  try {
    await location.save();
    req.user.stores = req.user.stores.concat({ location });
    await req.user.save();
    res.status(201).send({ location });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};
const get_all_locations = async (req, res) => {};

module.exports = {
  create_location,
  get_all_locations,
};
