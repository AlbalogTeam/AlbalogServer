const Employer = require('../../models/user/employer');

class EmployersService {
  constructor() {
    this.Employer = Employer;
  }

  async createEmployer(body) {
    const employer = new this.Employer(body);

    try {
      const checkEmail = await this.Employer.checkIfEmailExist(employer.email);

      if (checkEmail) {
        throw new Error('이미 가입되어있는 이메일입니다');
      }
      await employer.save();
      const token = await employer.generateAuthToken();
      return { employer, token };
    } catch (error) {
      throw new Error(error);
    }
  }
  getEmployerProfile(user) {
    if (!user) throw new Error('유저를 불러오지 못했습니다');
    return user;
  }
  async updateEmployerProfile(user, name, password, newPassword) {
    if (!user) throw new Error('수정 권한이 없습니다');

    if (password === '' || !password || password.length < 1)
      throw new Error('정보변경을 위해서 암호를 입력해주세요');

    try {
      const isMatch = await user.comparePasswords(password);
      if (!isMatch) throw new Error('현재 비밀번호가 다릅니다');

      if (newPassword === '' || !newPassword || newPassword.length < 1) {
        user.password = password;
      } else {
        user.password = newPassword;
      }
      user.name = name;
      await user.save();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // getEmployersAllLocation() {
  //   if (!req.owner) return res.status(400).send('권한이 없습니다');
  //   const locIds = req.owner.stores.map((ids) => ids.location); // get all objectIds from user.stores into arrays

  //   if (locIds.length < 1) {
  //     return res.status(400).send({
  //       message: '매장이 없습니다.',
  //     });
  //   }

  //   try {
  //     const locations = await Location.find({
  //       _id: { $in: locIds },
  //     });
  //     res.send({ locations });
  //   } catch (err) {
  //     res.status(500).send({
  //       message: err,
  //     });
  //   }
  // }
}

module.exports = EmployersService;
