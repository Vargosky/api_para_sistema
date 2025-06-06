const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: Number(process.env.EMAIL_PORT) === 465, // true si 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ⬇️ ahora la función recibe el enlace completo
async function enviarCorreoVerificacion(email, enlace) {
  await transporter.sendMail({
    from: `"EduCommand" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta',
    html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
           <a href="${enlace}">${enlace}</a>`,
  });
}

module.exports = enviarCorreoVerificacion;   // exporta como valor directo

