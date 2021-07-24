const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInvitationEmail = (name, email, locationId, invite) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    html: `<img src="https://user-images.githubusercontent.com/64634992/122313912-13b79b80-cf52-11eb-900a-a1d50bb073f9.png" /> <br> 안녕하세요, ${name}님. <br> <a href="http://localhost:3000/parttime/${locationId}/${invite._id}/signup" to=_blank>링크</a>를 눌러 회원가입을 완료하세요 `,
  });
};

const sendLocationAddedEmail = (name, email, location) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    html: `안녕하세요, ${name}님. ${location.name} 매장에 정상적으로 등록되었습니다.`,
  });
};

const sendResetPasswordEmail = (name, email, tokenId) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 비밀번호 변경',
    html: `안녕하세요, ${name}님. <br> <a href="http://localhost:3000/reset_password/${tokenId}" to=_blank>링크</a>를 눌러 비밀번호를 변경하세요`,
  });
};
const sendAskLocationAddEmail = (name, email, location, invite) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    html: `안녕하세요, ${name}님. ${location.name} 매장에 등록을 원하시면 <a href="http://localhost:3000/parttime/${location._id}/${invite._id}/join" to=_blank>링크</a>를 눌러 확인하세요.`,
  });
};

module.exports = {
  sendInvitationEmail,
  sendLocationAddedEmail,
  sendResetPasswordEmail,
  sendAskLocationAddEmail,
};
