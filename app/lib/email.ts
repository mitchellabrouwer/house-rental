import nodemailer from "nodemailer";

export default function sendEmail(to, subject, body) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: false, // true for 465, false for other ports

    auth: {
      user: process.env.EMAIL_SERVER_USER, // generated ethereal user
      pass: process.env.EMAIL_SERVER_PASSWORD, // generated ethereal password
    },
  });

  transporter.sendMail(
    {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: body,
    },
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent");
      }
    }
  );
}
