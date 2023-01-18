const nodemailer = require('nodemailer');


async function sendEmail(email,subject, text) {
    let transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      // proxy: "http://180.151.238.175:8085",
      auth: {
        user : 'apikey',
        pass : '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'
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: " info@harshaweb.com",
      to: email,
      subject: subject,
      text: text,
    //   html: "<b>Hello world?</b>",
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  

  
  module.exports= sendEmail;