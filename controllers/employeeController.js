const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Employee = require('../models/user/employee');
const Location = require('../models/location/location');
const Invite = require('../models/inviteToken');

const sendLocationName = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const isValidInviteToken = await Invite.findById(inviteId);

    if (!isValidInviteToken)
      return res.status(400).send('토큰정보가 유효하지 않습니다');

    jwt.verify(
      isValidInviteToken.invite_token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(400)
            .send({ success: false, message: '만료된 토큰입니다' });

        const location = await Location.findById(decoded.location);

        if (!location) {
          return res.status(400).send({
            message: '매장정보를 찾을 수 없거나 해당 유저와 관계없는 매장',
          });
        }
        return res.send({
          location_name: location.name,
          user_name: decoded.name,
          user_email: decoded.email,
        });
      }
    );
  } catch (error) {
    return res.status(500).send(error.toString());
  }
};

// 매장 스태프 만들기
const createEmployee = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const employee = new Employee(req.body);

    const checkEmail = await Employee.checkIfEmailExist(employee.email);
    if (checkEmail)
      return res.status(400).send({ message: 'Email is already taken' });

    employee.stores = employee.stores.concat({ location: location._id });
    const newEmployee = await employee.save();

    const token = await employee.generateAuthToken();

    // add an employee who belongs to the current location
    location.employees = location.employees.concat({ employee: newEmployee });
    await location.save();

    return res.status(201).send({ employee, token });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const logoutEmployee = async (req, res) => {
  try {
    req.staff.tokens = req.staff.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.staff.save();
    res.send({
      message: 'logged out',
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

const getEmployeeProfile = async (req, res) => {
  res.send(req.staff);
};

// 해당 직원의 모든 매장보기
const getEmployeeAllLocations = async (req, res) => {
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  const locIds = req.staff.stores.map((ids) => ids.location); // get all objectIds from user.stores into arrays

  if (locIds.length < 1) {
    return res.status(400).send({
      message: '매장이 없습니다.',
    });
  }

  try {
    const locations = await Location.find({
      _id: { $in: locIds },
    });
    return res.send({ locations });
  } catch (err) {
    return res.status(500).send({
      message: err,
    });
  }
};

const getEmployeeSingleLocation = async (req, res) => {
  const { locationId } = req.params;
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  try {
    const location = await Location.findOne({
      _id: mongoose.Types.ObjectId(locationId),
      'employees.employee': req.staff._id,
    }).populate('workManuals.category_id');
    location.workManuals = location.workManuals.filter((n) => !n.deleted);
    return res.send(location);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateEmployee = async (req, res) => {
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  const { name, password, newPassword, phone, gender, birthdate } = req.body;

  try {
    req.staff.name = name;
    req.staff.cellphone = phone;
    req.staff.gender = gender;
    req.staff.birthdate = birthdate;

    if (newPassword && newPassword.length > 0) {
      if (
        !password ||
        password.length < 1 ||
        password === undefined ||
        password === null
      )
        return res.status(400).send('비밀번호를 입력하세요');
      const isMatch = await req.staff.comparePasswords(password);
      if (!isMatch)
        return res.status(400).send({ message: '현재 비밀번호가 다릅니다' });

      req.staff.password = newPassword;
    }

    const staff = await req.staff.save();

    return res.send(staff);
  } catch (error) {
    return res.status(400).send(error.toString());
  }
};

module.exports = {
  createEmployee,
  logoutEmployee,
  getEmployeeProfile,
  getEmployeeAllLocations,
  getEmployeeSingleLocation,
  updateEmployee,
  sendLocationName,
};
