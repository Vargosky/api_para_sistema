const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarCorreoVerificacion(email, token) {
  const url = `https://api-para-sistema.vercel.app/api/usuarios/verificar/${token}`;
  
  await transporter.sendMail({
    from: `"EduCommand" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifica tu cuenta",
    html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
           <a href="${url}">${url}</a>`,
  });
}

module.exports = enviarCorreoVerificacion;
