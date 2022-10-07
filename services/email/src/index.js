import * as dotenv from "dotenv";
import nodemailer from "nodemailer";
import pg from "pg";

const { Client } = pg;
dotenv.config();

async function getUsersThatCheckedOut() {
  const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });

  console.log(Date.now());

  await client.connect();
  const res = await client.query(
    `SELECT "email", "id" FROM "Booking" WHERE "to"='2022-09-28 14:00:00' AND "paid"=true`
  );
  // const res = await client.query(
  //   `SELECT * FROM "Booking" WHERE "to"=(to_timestamp(${Date.now()} / 1000.0))`
  // );
  // JavaScript Date.now() returns the number of milliseconds since the Unix
  // Epoch (1 Jan 1970). PostgreSQL to_timestamp(…) converts a single argument,
  // interpreted as the number of seconds since the Unix Epoch into a PosgtreSQL
  // timestamp. At some point, the JavaScript value needs to be divided by 1000.

  await client.end();
  return res.rows || [];
  // return res.rows.map((row) => row.email) || [];
}

function sendEmail(to, subject, body) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: true,

    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  console.log("to", to);
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

(async function run() {
  const bookings = await getUsersThatCheckedOut();

  console.log("bookings", bookings);
  bookings.forEach((booking) => {
    sendEmail(
      booking.email,
      "Please review your stay",
      `<a href="http://localhost:3000/review/${booking.id}">Click here to review your recent trip</a>`
    );
  });
})();
