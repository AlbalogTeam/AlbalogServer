import Location from '../models/location/location';
// import checkOwnerHasLocation from '../middleware/checkOwnerHasLocation';

const create_location = async (req, res) => {
  const location = new Location({ ...req.body, owner: req.user._id });

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

//매장 정보 읽기
const get_location = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);
    res.send({ location });
  } catch (error) {
    res.status(500).send({ error });
  }
};

//매장 정보 수정(이름 주소 우편번호 전화번호)
const update_location = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findById(id);

  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'address', 'postal_code', 'phone_number'];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdates)
    return res.status(400).send({
      message: 'invalid update',
    });

  try {
    updates.forEach((update) => (location[update] = req.body[update]));
    location.owner = req.user._id;
    const updatedLocation = await location.save();
    res.send(updatedLocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

//매장 스태프 추가

//매장 스태프 수정

//매장 스태프 삭제

module.exports = {
  create_location,
  get_location,
  update_location,
};
