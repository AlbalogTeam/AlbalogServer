import Location from '../models/location/location';
import Employee from '../models/user/employee';
import Category from '../models/location/category';
import Invite from '../models/inviteToken';
import {
  sendInvitationEmail,
  sendLocationAddedEmail,
} from '../emails/accounts';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const create_location = async (req, res) => {
  if (!req.owner)
    return res.status(401).send({ message: '매장 생성 권한이없습니다' });

  const location = new Location({ ...req.body, owner: req.owner._id });

  try {
    await location.save();

    req.owner.stores = req.owner.stores.concat({ location });
    await req.owner.save();

    res.status(201).send({ location });
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

//매장 정보 읽기
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

//매장 정보 수정(이름 주소 우편번호 전화번호)
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
  const { locationId } = req.params; //해당 매장 아이디
  if (!req.owner)
    return res.status(400).send({ message: '관리자 로그인이 필요합니다' });
  try {
    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });
    if (!location)
      return res.status(400).send({ message: '매장 정보가 없습니다' });

    const checkEmail = await Employee.checkIfEmailExist(email);

    if (checkEmail) {
      const existingEmployee = await Employee.findOne({ email });

      const employeeIdsArr = location.employees.map((id) => id.employee);

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
      const token = jwt.sign(
        {
          name: name,
          email: email,
          location: locationId,
        },
        process.env.JWT_SECRET
      );
      const invite = new Invite({ invite_token: token });
      await invite.save();

      sendInvitationEmail(name, email, location._id, invite);
      res.send({ name, email, location, invite });
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

//매장 스태프 삭제

//해당 매장 직원 리스트
const get_all_employees = async (req, res) => {
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

//매장 직원 개인정보
const get_employee_info = async (req, res) => {
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

//스태프 hourly_wage, status 설정
//enum: ['재직자', '퇴직자'],
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

const createNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }
    const { locationId } = req.params;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    const { title, content } = req.body;
    const idx = !location.notices[location.notices.length - 1]
      ? 0
      : location.notices[location.notices.length - 1].idx + 1;

    const notice = { idx, title, content };

    if (!notice) {
      res.status(500).send({
        message: 'Cannot create Notice',
      });
    }

    location.notices.push(notice);

    await location.save();

    res.status(201).send({
      message: 'Create notice Successfully',
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readNotice = async (req, res) => {
  const { locationId } = req.params;
  try {
    const location = await Location.findOne({
      _id: locationId,
    });
    const notices = location.notices.sort((a, b) => -1);

    res.status(200).send({
      notices,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const readOneNotice = async (req, res) => {
  try {
    const { locationId, _id } = req.params;

    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const notice = location.notices.filter((n) => n._id.toString() === _id);

    if (!notice) {
      res.status(500).send({
        message: 'Cannot find One Notice',
      });
    }
    res.status(200).send({ notice });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const updateNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, _id } = req.params;
    const { title, content } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const notices = location.notices;
    let originNotice;
    for (let notice of notices) {
      if (notice._id.toString() === _id) {
        originNotice = notice;
        notice.title = title;
        notice.content = content;
        break;
      }
    }

    await location.save();

    if (!originNotice) {
      res.status(500).send({
        message: 'Cannot Update Notice',
      });
    }

    res.status(201).send({
      updatedNotice: originNotice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const deleteNotice = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const { locationId, _id } = req.params;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const notices = location.notices;
    let deletedNotice;

    for (let idx in notices) {
      const notice = notices[idx];
      if (notice._id.toString() === _id) {
        deletedNotice = notice;
        notice.remove(idx);
        break;
      }
    }

    if (!deletedNotice) {
      res.status(500).send({
        message: 'Cannot Delete Notice',
      });
    }

    await location.save();

    res.status(201).send({
      deletedNotice: deletedNotice,
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

const searchNotice = async (req, res) => {
  try {
    const { locationId, content } = req.body;

    const location = await Location.findOne({
      _id: locationId,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const findByContent = location.notices.map((n) => {
      if (n.content.indexOf(content) >= 0) return n;
    });
    const findByTitle = location.notices.map((n) => {
      if (n.title.indexOf(content) >= 0) return n;
    });

    const finalNotices = [...findByContent, ...findByTitle].filter(
      (n) => n != null
    );
    const deleteDuplicate = [...new Set(finalNotices)];

    if (finalNotices.length < 1) {
      res.status(200).send([]);
    }
    res.status(200).send(deleteDuplicate);
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

// workManual

export const createWorkManual = async (req, res) => {
  const { locationId } = req.params;
  const { title, content, category } = req.body;

  const existCategory = await Category.findOne({ _id: category, locationId });

  if (!existCategory)
    return res.status(400).send('카테고리 id 혹은 정보가가 잘못되었습니다');

  const categoryId = mongoose.Types.ObjectId(category);

  try {
    if (!req.owner) {
      throw new Error('you are not owner');
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      res.status(500).send({
        message: 'Cannot Find Category',
      });
    }

    const workManual = {
      title,
      content,
      category_id: categoryId,
    };

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    location.workManuals.push(workManual);

    await location.save();

    res.status(201).send({
      message: 'Create Manual Successfully',
    });
  } catch (err) {
    res.status(500).send({
      message: err.toString(),
    });
  }
};

export const readWorkManual = async (req, res) => {
  const { locationId } = req.params;

  try {
    const location = await Location.findById({
      _id: locationId,
    }).populate('workManuals.category_id');
    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const manualObject = {
      location: location.name,
      workManuals: location.workManuals.filter((v) => v.deleted === false),
    };

    res.status(200).send(manualObject);
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

const readOneWorkManual = async (req, res) => {
  try {
    const location = await Location.findOne({
      _id: req.params.locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
      return;
    }

    const workManual = location.workManuals.filter(
      (w) => w._id.toString() === req.params._id && w.deleted === false
    );
    if (!workManual) {
      res.status(500).send({
        message: 'Cannot find One Manual',
      });
    }
    res.status(201).send({
      workManual,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// 카테고리 수정하는것 추가해야함, 추가논의후 결정
const updateWorkManual = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('You are not owner');
    }

    const { locationId, _id } = req.params;
    const { title, content, category } = req.body;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }
    const workManuals = location.workManuals;
    let originManual;
    for (let workManual of workManuals) {
      if (workManual._id.toString() === _id && !workManual.deleted) {
        workManual.title = title;
        workManual.content = content;
        workManual.category_id = category;
        originManual = workManual;
        break;
      }
    }

    await location.save();

    if (!originManual) {
      res.status(500).send({
        message: 'Cannot Update Manual',
      });
    }

    res.status(201).send({
      updatedWorkManual: originManual,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

const deleteWorkManual = async (req, res) => {
  try {
    if (!req.owner) {
      throw new Error('You are not owner');
    }

    const { locationId, _id } = req.params;

    const location = await Location.findOne({
      _id: locationId,
      owner: req.owner._id,
    });

    if (!location) {
      res.status(400).send({
        message: '해당 매장 정보를 찾을 수 없습니다.',
      });
    }

    const workManuals = location.workManuals;
    let deletedWorkManual;

    for (let idx in workManuals) {
      const workManual = workManuals[idx];
      if (workManual._id.toString() === _id) {
        workManual.deleted = true;
        deletedWorkManual = workManual;
        break;
      }
    }

    if (!deletedWorkManual) {
      res.status(500).send({
        message: 'Cannot Delete Manual',
      });
    }

    await location.save();

    res.status(201).send({
      deletedWorkManual: deletedWorkManual,
    });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

module.exports = {
  //location
  create_location,
  get_location,
  update_location,
  invite_employee,
  update_employee_wage_status,
  get_all_employees,
  get_employee_info,
  //notice
  deleteNotice,
  updateNotice,
  readOneNotice,
  readNotice,
  createNotice,
  searchNotice,
  //workManual
  createWorkManual,
  readWorkManual,
  readOneWorkManual,
  updateWorkManual,
  deleteWorkManual,
};
