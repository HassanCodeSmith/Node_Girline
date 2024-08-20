// require("dotenv").config();

// const sgMail = require("@sendgrid/mail");
// exports.sendEmail = async (options) => {
//   const { email, subject, html } = options;

//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const message = {
//     to: email,
//     from: process.env.FROM_EMAIL, // Use the email address or domain you verified above
//     subject: subject,
//     html: html,
//   };
//   sgMail.send(message).then(
//     () => {
//       console.log("email sent");
//     },
//     (error) => {
//       console.error(error);

//       if (error.response) {
//         console.error(error.response.body);
//       }
//     }
//   );
// };

const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.FROM_EMAIL_ADDRESS,
      pass: process.env.PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `<${process.env.FROM_EMAIL_ADDRESS}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
