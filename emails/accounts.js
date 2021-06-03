import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInvitationEmail = (name, email, locationId) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    text: `안녕하세요, ${name}님. 아래 링크를 눌러 회원가입을 완료하세요 http://localhost:5000/api/v1/employee/${locationId}/signup`,
  });
};

const sendLocationAddedEmail = (name, email, location) => {
  sgMail.send({
    to: email,
    from: 'dongwan.don.kim@gmail.com',
    subject: '알바로그: 직원초대',
    text: `안녕하세요, ${name}님. ${location.name} 매장에 정상적으로 등록되었습니다.`,
  });
};

module.exports = {
  sendInvitationEmail,
  sendLocationAddedEmail,
};
