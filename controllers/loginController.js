import Employer from '../models/user/employer';
import Employee from '../models/user/employee';
import { sendResetPasswordEmail } from '../emails/accounts';
import jwt from 'jsonwebtoken';
import Invite from '../models/inviteToken';

//login
const login_user = async (req, res) => {
  try {
    let user = await Employer.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      user = await Employee.findByCredentials(
        req.body.email,
        req.body.password
      );
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res
      .status(400)
      .send({ message: 'Unable to login', error: error.toString() });
  }
};

//find password
const find_password = async (req, res) => {
  const { email, name } = req.body;

  try {
    const owner = await Employer.findOne({ email, name });
    const staff = await Employee.findOne({ email, name });

    if (!owner && !staff) {
      res.status(400).send('등록되지않은 이메일 혹은 이름입니다');
    }

    if (owner && !staff) {
      const token = jwt.sign(
        {
          name: owner.name,
          email: owner.email,
        },
        process.env.JWT_SECRET
      );
      const invite = new Invite({ invite_token: token });
      await invite.save();

      sendResetPasswordEmail(owner.name, email, invite._id);
      res.send(owner.name, email, invite._id);
    } else if (!owner && staff) {
      const token = jwt.sign(
        {
          name: staff.name,
          email: staff.email,
        },
        process.env.JWT_SECRET
      );
      const invite = new Invite({ invite_token: token });
      await invite.save();
      sendResetPasswordEmail(staff.name, email, invite._id);
      res.send(staff.name, email, invite._id);
    } else if (owner && staff) {
      res.status(400).send('같은 이메일이 직원과 관리자 둘다있음');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const change_password = async (req, res) => {};
module.exports = { login_user, find_password, change_password };
