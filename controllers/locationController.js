import Location from '../models/location/location';
import Employee from '../models/user/employee';
import {
  sendInvitationEmail,
  sendLocationAddedEmail,
} from '../emails/accounts';
import Board from "../models/location/board.js";

const create_location = async (req, res) => {

  const location = new Location({ ...req.body, owner: req.owner._id });
  const board = new Board();
  location.board = board._id;
  try {
    await board.save();
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

  try {
    const location = await Location.findOne({ _id: id, owner: req.owner._id });
    if (!location)
      return res.status(400).send({ message: '매장정보가 잘못되었습니다' });

    const checkEmail = await Employee.checkIfEmailExist(email);
    if (checkEmail) {
      const existingEmployee = await Employee.findOne({ email });

      const employeeIdsArr = location.employees.map((id) => id.employee);
      console.log(employeeIdsArr);

      //check if employee already belongs to the location
      if (employeeIdsArr.includes(existingEmployee._id))
        return res.send('이미 해당 매장의 직원으로 등록되어있습니다');

      location.employees = location.employees.concat({
        employee: existingEmployee._id,
      });
      await location.save();

      existingEmployee.stores = existingEmployee.stores.concat({ location });
      await existingEmployee.save();

      // sendLocationAddedEmail
      sendLocationAddedEmail(name, email, location);

      return res.send({
        message: '해당직원을 추가하였습니다',
      });
    } else {
      sendInvitationEmail(name, email, location._id);
      res.send({ name, email, location });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

//매장 스태프 수정  enum: ['Working', 'Quit', 'Vacation'],

//매장 스태프 삭제

module.exports = {
  create_location,
  get_location,
  update_location,
  invite_employee,
};
