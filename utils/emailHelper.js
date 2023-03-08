import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv'
dotenv.config()


const {SMTP_PORT,SMTP_HOST,SMTP_USER,SMTP_PASS} = process.env


const mailHelper = async (options) => {
    const transporter = nodemailer.createTransport({
        host:SMTP_HOST,
        port: SMTP_PORT,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });

    const message = {
        from: 'piyuindia4@gmail.com',
        to: options.email,
        subject: options.subject,
        text: options.textMessage,
        // html: "<b>Hello world?</b>",
    }
    await transporter.sendMail(message);
}

export default mailHelper