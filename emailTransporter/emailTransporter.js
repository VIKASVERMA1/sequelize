const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  requireTLS: true,
  auth: {
    user: "vikashverma209200@gmail.com",
    pass: "vikas@9773",
  },
});
module.exports = 
    transporter

