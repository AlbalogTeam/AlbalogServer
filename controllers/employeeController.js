import Employee from '../models/user/employee';
import Location from '../models/location/location';

//매장 스태프 만들기
const create_employee = async (req, res) => {
  const locationId = req.params.id;

  try {
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(400).send({ message: '매장정보를 찾을 수 없습니다' });
    }

    const employee = new Employee(req.body);
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

module.exports = { create_employee };
