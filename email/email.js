
const nodemailer = require("nodemailer");
const ConfirmEmail = require("./confirmationEmail");
const Notify = require("./Notify");

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail'
  auth: {
    user: process.env.EMAIL, // your email address
    pass: process.env.EMAIL_KEY_SECRET, // your email password
  },
}); 

async function emailVerify(link, userEmail) {
    try {
      const htmlContent = ConfirmEmail.confirmEmailHTML(link);
  
      const mailOptions = {
        from: `SOFTINSA <${process.env.EMAIL}>`,
        to: userEmail,
        subject: 'Confirme o seu endereço de Email',
        html: htmlContent,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email enviado para', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }
async function notifyUser(userEmail,title, message, resumo) {
    try {
      const htmlContent = Notify.notifyUserHTML(title, message, resumo);
  
      const mailOptions = {
        from: `SOFTINSA <${process.env.EMAIL}>`,
        to: userEmail,
        subject: title,
        html: htmlContent,
      };
  
      await transporter.sendMail(mailOptions);
      console.log('Email enviado para', userEmail);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }


module.exports = {
  emailVerify,
  notifyUser
}