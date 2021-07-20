const jwt = require('jsonwebtoken');
const Employer = require('../models/user/employer');
const Employee = require('../models/user/employee');
const { sendResetPasswordEmail } = require('../emails/accounts');

const Invite = require('../models/inviteToken');

// login
const loginUser = async (req, res) => {
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

    if (!user) {
      return res.status(400).send({ success: false, message: '유저없음' });
    }

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Unable to login', error: error.toString() });
  }
};

// find password
const findPassword = async (req, res) => {
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
      res.status(400).send('같은 이메일이 직원과 관리자에 둘다있음');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const sendUserInfo = async (req, res) => {
  const { tokenId } = req.params;
  try {
    const isValidInviteToken = await Invite.findById(tokenId);

    if (!isValidInviteToken)
      return res.status(400).send('토큰정보가 유효하지 않습니다');
    res.send('토큰 유효함! 비번 변경 가능');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const resetPassword = async (req, res) => {
  const { tokenId, newPassword } = req.body;
  try {
    const isValidInviteToken = await Invite.findById(tokenId);

    if (!isValidInviteToken)
      return res.status(400).send('토큰정보가 유효하지 않습니다');

    const decoded = jwt.verify(
      isValidInviteToken.invite_token,
      process.env.JWT_SECRET
    );

    const owner = await Employer.findOne({
      name: decoded.name,
      email: decoded.email,
    });
    const staff = await Employee.findOne({
      name: decoded.name,
      email: decoded.email,
    });

    if (!owner && !staff)
      return res.status(400).send('사용자를 찾을 수 없습니다');

    if (owner && !staff) {
      owner.password = newPassword;
      await owner.save();

      return res.send({ message: '비밀번호가 변경되었습니다', owner });
    }
    if (!owner && staff) {
      staff.password = newPassword;
      await staff.save();

      return res.send({ message: '비밀번호가 변경되었습니다', staff });
    }
    return res.send('같은 이메일이 직원과 관리자에 둘다있음');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { loginUser, findPassword, sendUserInfo, resetPassword };
