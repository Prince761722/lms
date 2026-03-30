import dotenv from 'dotenv';
dotenv.config();
import sendEmail from '../utils/sendEmail.js';

const contact = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        
        const html = `
      <h2>New Contact Message</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Subject:</b> ${subject || "N/A"}</p>
      <p><b>Message:</b> ${message}</p>
    `;

        await sendEmail({
            email: process.env.SMTP_USER,
            subject: subject || "Contact Form Message",
            message: html,
            replyTo: email
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {
        console.error('Contact form error:', error.message || error);

        res.status(500).json({
            success: false,
            message: error.message || "Failed to send message"
        });
    }
};


export default contact