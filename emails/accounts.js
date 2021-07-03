import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInvitationEmail = (name, email, locationId, invite) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    html: `안녕하세요, ${name}님. <br> <a href="http://localhost:3000/parttime/${locationId}/${invite._id}/signup" to=_blank>링크</a>를 눌러 회원가입을 완료하세요 `,
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

const sendResetPasswordEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 비밀번호 변경',
    html: `안녕하세요, ${name}님. <br> <a href="http://localhost:3000/reset_password" to=_blank>링크</a>를 눌러 비밀번호를 변경하세요`,
  });
};

module.exports = {
  sendInvitationEmail,
  sendLocationAddedEmail,
  sendResetPasswordEmail,
};
