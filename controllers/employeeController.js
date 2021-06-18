import Employee from '../models/user/employee';
import Location from '../models/location/location';
import mongoose from 'mongoose';

//매장 스태프 만들기
const create_employee = async (req, res) => {
  const locationId = req.params.locationId;

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

    //add an employee who belongs to the current location
    location.employees = location.employees.concat({ employee: newEmployee });
    await location.save();

    res.status(201).send({ employee, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const login_employee = async (req, res) => {
  try {
    const employee = await Employee.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await employee.generateAuthToken();

    res.send({ employee, token });
  } catch (error) {
    res.status(400).send('Unable to login');
  }
};

const logout_employee = async (req, res) => {
  try {
    req.staff.tokens = req.staff.tokens.filter((token) => {
      return token.token !== req.token;
    });

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

const get_employee = async (req, res) => {
  res.send(req.staff);
};

//해당 직원의 모든 매장보기
const get_employee_locations = async (req, res) => {
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  const locIds = req.staff.stores.map((ids) => ids.location); //get all objectIds from user.stores into arrays

  if (locIds.length < 1) {
    return res.status(400).send({
      message: '매장이 없습니다.',
    });
  }

  try {
    const locations = await Location.find({
      _id: { $in: locIds },
    });
    res.send({ locations });
  } catch (err) {
    res.status(500).send({
      message: err,
    });
  }
};

const get_single_location = async (req, res) => {
  const locationId = mongoose.Types.ObjectId(req.params.locationId);
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  try {
    const location = await Location.findOne({
      _id: locationId,
      'employees.employee': req.staff._id,
    }).populate('workManuals.category_id');
    res.send(location);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update_employee = async (req, res) => {
  if (!req.staff) return res.status(400).send('권한이 없습니다');
  const { name, password, newPassword, phone, gender, birthdate } = req.body;

  try {
    const isMatch = await req.staff.comparePasswords(password);
    if (!isMatch)
      return res.status(400).send({ message: '현재 비밀번호가 다릅니다' });

    if (newPassword === '' || !newPassword || newPassword.length < 1)
      req.staff.password = password;

    req.staff.name = name;
    req.staff.cellphone = phone;
    req.staff.gender = gender;
    req.staff.birthdate = birthdate;

    await req.staff.save();
    res.send(req.staff);
  } catch (error) {
    res.status(400).send(error.toString());
  }
};

module.exports = {
  create_employee,
  login_employee,
  logout_employee,
  get_employee,
  get_employee_locations,
  get_single_location,
  update_employee,
};
