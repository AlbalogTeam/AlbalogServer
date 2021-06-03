import Location from '../models/location/location';
import Employee from '../models/user/employee';
import { sendInvitationEmail } from '../emails/accounts';

const create_location = async (req, res) => {
  const location = new Location({ ...req.body, owner: req.owner._id });

  try {
    await location.save();

    req.owner.stores = req.owner.stores.concat({ location });
    await req.owner.save();
    res.status(201).send({ location });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

//매장 정보 읽기
const get_location = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findOne({ _id: id, owner: req.owner._id });
    res.send(location);
  } catch (error) {
    res.status(500).send({ error });
  }
};

//매장 정보 수정(이름 주소 우편번호 전화번호)
const update_location = async (req, res) => {
  const { id } = req.params;
  const location = await Location.findOne({ _id: id, owner: req.owner._id });

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
    location.owner = req.owner._id;
    const updatedLocation = await location.save();
    res.send(updatedLocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

//매장 스태프 초대
const invite_employee = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params; //해당 매장 아이디
  console.log(id);

  try {
    const location = await Location.findOne({ _id: id, owner: req.owner._id });
    if (!location)
      return res.status(400).send({ message: '매장정보가 잘못되었습니다' });
    sendInvitationEmail(name, email, location._id);
    res.send({ name, email, location });
  } catch (error) {
    res.status(500).send(error);
  }
};

//매장 스태프 수정

//매장 스태프 삭제

module.exports = {
  create_location,
  get_location,
  update_location,
  invite_employee,
};
