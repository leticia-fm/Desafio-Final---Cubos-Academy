const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.DB_HOST_MAIL,
    port: process.env.DB_PORT,
    auth: {
        user: process.env.DB_USER_MAIL,
        pass: process.env.DB_PASS_MAIL
    }
})

module.exports = transporter;