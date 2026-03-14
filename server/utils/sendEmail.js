import nodemailer from 'nodemailer';

const sendEmail = async({email,subject,message}) =>{
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,  
        subject: subject,
        html: message
    });
}

export default sendEmail;