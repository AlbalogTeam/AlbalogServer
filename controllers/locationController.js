const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Location = require('../models/location/location');
const Employee = require('../models/user/employee');
const Invite = require('../models/inviteToken');

const {
  sendInvitationEmail,
  sendLocationAddedEmail,
  sendAskLocationAddEmail,
} = require('../emails/accounts');

const createLocation = async (req, res) => {
  if (!req.owner)
    return res.status(401).send({ message: '매장 생성 권한이없습니다' });

  const location = new Location({ ...req.body, owner: req.owner._id });

  try {
    await location.save();

    req.owner.stores = req.owner.stores.concat({ location });
    await req.owner.save();

    return res.status(201).send({ location });
  } catch (error) {
    return res.status(500).send(error.toString());
  }
};

// 매장 정보 읽기
const get_location = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await Location.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(locationId),
          owner: mongoose.Types.ObjectId(req.owner._id),
        },
      },
      { $unwind: { path: '$notices', preserveNullAndEmptyArrays: true } },
      { $sort: { 'notices.createdAt': -1 } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          address: { $first: '$address' },
          postal_code: { $first: '$postal_code' },
          phone_number: { $first: '$phone_number' },
          employees: { $first: '$employees' },
          workManuals: { $first: '$workManuals' },
          notices: { $push: '$notices' },
          transitions: { $first: '$transitions' },
        },
      },
    ]);
    await Location.populate(location, {
      path: 'employees.employee workManuals.category_id',
    });

    location[0].workManuals = location[0].workManuals.filter((n) => !n.deleted);

    if (!location) return res.status(403).send('해당 매장의 권한이없습니다');
    res.send(...location);
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

// 매장 정보 수정(이름 주소 우편번호 전화번호)
const update_location = async (req, res) => {
  if (!req.owner)
    return res
      .status(400)
      .send({ message: '해당 매장의 관리자만 수정 가능합니다' });

  const { locationId } = req.params;

  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) return res.status(400).send('매장 정보가 없습니다');

    const updates = Object.keys(req.body);

    const allowedUpdates = ['name', 'address', 'postal_code', 'phone_number'];
    const isValidUpdates = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdates)
      return res.status(400).send({
        message: 'invalid update',
      });
    updates.forEach((update) => {
      location[update] = req.body[update];
    });
    location.owner = req.owner._id;
    const updatedLocation = await location.save();
    res.send(updatedLocation);
  } catch (error) {
    res.status(400).send(error);
  }
};

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

const alreadyExistsEmployee = async (req, res) => {
  const { inviteId } = req.params;

  try {
    const invite = await Invite.findById(inviteId);
    if (!invite) return res.status(400).send('토큰정보가 유효하지 않습니다');

    jwt.verify(
      invite.invite_token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        if (err)
          return res
            .status(400)
            .send({ success: false, message: '만료된 토큰입니다' });

        const location = await Location.findById(decoded.location);

        if (!location) {
          return res.status(400).send({
            success: false,
            message: '매장정보를 찾을 수 없거나 해당 유저와 관계없는 매장',
          });
        }
        const existingEmployee = await Employee.findOne({
          email: decoded.email,
        });
        location.employees = location.employees.concat({
          employee: existingEmployee._id,
        });
        await location.save();

        existingEmployee.stores = existingEmployee.stores.concat({ location });
        await existingEmployee.save();

        // sendLocationAddedEmail
        sendLocationAddedEmail(
          existingEmployee.name,
          existingEmployee.email,
          location
        );

        return res.send({
          success: true,
          message: '해당직원을 추가하였습니다',
        });
      }
    );
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// 매장 스태프 초대
const invite_employee = async (req, res) => {
  const { name, email } = req.body;
  const { locationId } = req.params;

  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });
    if (!location)
      return res.status(400).send({ message: '매장 정보가 없습니다' });

    const existingEmployee = await Employee.findOne({ email });

    const employeeIdsArr = location.employees.map((id) => id.employee);

    // check if employee already belongs to the location
    if (employeeIdsArr.includes(existingEmployee?._id))
      return res
        .status(400)
        .send({
          success: false,
          message: '이미 해당 매장의 직원으로 등록되어있습니다',
        });

    const checkEmail = await Employee.checkIfEmailExist(email);
    if (checkEmail) {
      const token = jwt.sign(
        {
          name: name,
          email: email,
          location: locationId,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        }
      );

      const invite = new Invite({ invite_token: token });
      await invite.save();

      sendAskLocationAddEmail(name, email, location, invite);
      return res.send({
        success: true,
        message: '이미 계정있음. 계정 이메일로 등록 링크 보냄',
      });
    }

    const token = jwt.sign(
      {
        name: name,
        email: email,
        location: locationId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const invite = new Invite({ invite_token: token });
    await invite.save();

    sendInvitationEmail(name, email, location._id, invite);
    return res.send({ name, email, location, invite });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

// 매장 스태프 삭제

// 해당 매장 직원 리스트
const getAllEmployees = async (req, res) => {
  const { locationId } = req.params;
  if (!req.owner) return res.status(400).send({ message: '권한이 없습니다' });
  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });
    if (!location)
      return res
        .status(400)
        .send({ message: '해당 매장의 접속 권한이없습니다' });

    const staffIds = location.employees.map((employee) => employee.employee);

    const employees = await Employee.find({ _id: { $in: staffIds } });

    res.send(employees);
  } catch (error) {
    res.status(400).send(error);
  }
};

// 매장 직원 개인정보
const getEmployeeInfo = async (req, res) => {
  const { locationId, employeeId } = req.params;
  try {
    const isEmployee = await Location.checkIfUserBelongsToLocation(
      locationId,
      employeeId
    );

    if (!isEmployee) {
      return res.status(400).send({ message: '해당 매장의 직원이 아닙니다' });
    }

    res.send(isEmployee);
  } catch (error) {
    res.status(500).send(error);
  }
};

// 스태프 hourly_wage, status 설정
// enum: ['재직자', '퇴직자'],
const update_employee_wage_status = async (req, res) => {
  const { hourly_wage, status } = req.body;

  if (typeof hourly_wage !== 'number')
    return res.status(400).send({ message: '숫자만 가능' });
  if (typeof status !== 'string')
    return res.status(400).send({
      message: '직원 상태는 문자열만 가능 "재직자", "퇴직자"',
    });

  const { locationId, employeeId } = req.params;

  try {
    const isEmployee = await Location.checkIfUserBelongsToLocation(
      locationId,
      employeeId
    );

    if (!isEmployee) {
      return res.status(400).send({ message: '해당 매장의 직원이 아닙니다' });
    }
    isEmployee.hourly_wage = hourly_wage;
    isEmployee.status = status;

    await isEmployee.save();
    res.send({ message: '시급 수정 완료', isEmployee });
  } catch (error) {
    res.status(500).send(error);
  }
};



module.exports = {
  // location
  createLocation,
  get_location,
  update_location,
  sendLocationName,
  alreadyExistsEmployee,
  invite_employee,
  update_employee_wage_status,
  getAllEmployees,
  getEmployeeInfo,
};
