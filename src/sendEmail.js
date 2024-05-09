import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar esto según el proveedor de correo que utilices
    auth: {
      user: 'cubikonlinetest@gmail.com', // Reemplaza con tu correo electrónico
      pass: 'Cubik12345', // Reemplaza con tu contraseña
    },
  });

export const sendConfirmationEmail = async (user) => {
  

  const mailOptions = {
    from: 'tu-correo@gmail.com',
    to: user.email,
    subject: 'Confirmación de cambio de contraseña',
    text: `Tu código de confirmación es: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado');
    return token;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};