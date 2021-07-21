const Employer = require('../../models/user/employer');

class EmployersService {
  constructor() {
    this.Employer = Employer;
  }

  async createEmployer(body) {
    const employer = new this.Employer(body);

    try {
      const checkEmail = await this.Employer.checkIfEmailExist(employer.email);
      console.log(checkEmail);

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
}

module.exports = EmployersService;
