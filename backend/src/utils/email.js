require("dotenv").config();
const nodemailer = require("nodemailer");
async function mail(sent_to_emails, subject, message) {

  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, 
    port: 587, 
    secure:  false, 
    auth: {
      user: process.env.MAIL_USERNAME, 
      pass: process.env.MAIL_PASSWORD, 
      
    },
    tls: {
      rejectUnauthorized: false,
    },

  }); 
  // await transporter.sendMail({
  //   from: process.env.MAIL_FROM_ADDRESS,
  //   to: sent_to_emails.join(', '),
  //   subject: subject,
  //   html: message,
  // });
  // Ensure sent_to_email is always an array
  if (!Array.isArray(sent_to_emails)) {
    sent_to_emails = [sent_to_emails];
  }

  for (const email of sent_to_emails) {
    await transporter.sendMail({
      from: `${process.env.APP_NAME} ${process.env.MAIL_FROM_ADDRESS}`,
      to: email,
      subject: subject,
      html: message,
    });
  }


}

module.exports = {mail};
