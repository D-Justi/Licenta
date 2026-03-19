import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendAppointmentConfirmation(toEmail, clientName, service, date) {
  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: 'Confirmare programare - Drăghici și Asociații',
    html: `
    <div style="background-color: #1a1a2e; padding: 40px; font-family: Arial, sans-serif; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 10px; padding: 30px;">
            <h1 style="color: #c9a84c; text-align: center;">Drăghici și Asociații</h1>
            <hr style="border-color: #c9a84c;">
            <h2 style="color: #ffffff;">Bună ziua, ${clientName}!</h2>
            <p style="color: #cccccc;">Programarea dumneavoastră a fost confirmată cu succes.</p>
            <div style="background-color: #0f3460; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p><b style="color: #c9a84c;">Serviciu:</b> <span style="color: #ffffff;">${service}</span></p>
                <p><b style="color: #c9a84c;">Data:</b> <span style="color: #ffffff;">${date}</span></p>
            </div>
            <p style="color: #cccccc;">Vă mulțumim că ați ales serviciile noastre.</p>
            <p style="text-align: center; color: #c9a84c; font-size: 12px;">© 2026 Drăghici și Asociații</p>
        </div>
    </div>
`
  })
}

export { sendAppointmentConfirmation };
