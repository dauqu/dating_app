const nodemailer = require('nodemailer');


async function sendEmail(email,subject, text) {
  // console.log(process.env.Email_from) //check if email is coming from env file
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      // proxy: "http://180.151.238.175:8085",
      auth: {
        user : process.env.smtp_user,
        pass : process.env.smtp_pass
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.Email_from,
      to: email,
      subject: subject,
      text: text,
    //   html: "<b>Hello world?</b>",
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  

  
  module.exports= sendEmail;