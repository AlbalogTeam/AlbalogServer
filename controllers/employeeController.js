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
    console.log(error);
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
    console.log('sdfasdfa');
    req.staff.tokens = req.staff.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.staff.save();
    res.send({
      message: 'Success Logout',
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

const get_employee_locations = async (req, res) => {
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

  try {
    const location = await Location.findOne({
      _id: locationId,
      'employees.employee': req.staff._id,
    });
    res.send(location);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update_employee = async (req, res) => {
  const body = req.body;

  const updates = Object.keys(body);
  const allowedUpdates = [
    'name',
    'password',
    'birthdate',
    'cellphone',
    'gender',
  ];
  const isValidUpdates = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdates) {
    return res.status(400).send({
      message: 'invalid update',
    });
  }

  try {
    updates.forEach((update) => (req.staff[update] = body[update]));
    await req.staff.save();
    res.send(req.staff);
  } catch (error) {
    res.status(400).send(error);
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
