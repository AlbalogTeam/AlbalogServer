import Employer from '../models/user/employer';

const create_employer = async (req, res) => {
  const employer = new Employer(req.body);
  try {
    const checkEmail = await Employer.checkIfEmailExist(employer.email);

    if (checkEmail) {
      return res.status(400).send({ message: 'Email is already taken' }); //check if user's email already exist
    } else {
      await employer.save();

      // const token = await user.generateAuthToken();

      res.status(201).send({ employer });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { create_employer };
