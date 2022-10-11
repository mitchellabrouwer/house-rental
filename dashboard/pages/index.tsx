import { Prisma } from "@prisma/client";
import Head from "next/head";
import pool from "../lib/pg";

export default function Home({ bookings, reviews }) {
  console.log("bookings", bookings);
  console.log("reviews", reviews);

  return (
    <div>
      <Head>
        <title />
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-white-800 mt-4 mb-2 text-center text-4xl font-normal leading-normal">
        House dashboard
      </h1>
      <ul>
        <li>total people stayed</li>
        <li>total nights stayed</li>
        <li>average rating</li>
        <li>Total Earnings</li>
        <li>Show graph of money and by month</li>
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  let bookings;
  let reviews;

  try {
    const client = await pool.connect();

    const bookingStats = Prisma.sql`
      SELECT 
        COUNT (*) AS "Total bookings",
        SUM ("guests") AS "Total guests",
        SUM ("price") AS "Total earnings"
      FROM "Booking" 
      WHERE paid=true`;

    const bookingRes = await client.query(bookingStats);
    console.log(bookingRes.rows[0]);
    bookings = JSON.parse(JSON.stringify(bookingRes.rows[0]));

    const reviewStats = Prisma.sql`
      SELECT 
        AVG ("rating") AS "Average rating"
      FROM "Review" 
    `;

    const reviewRes = await client.query(reviewStats);
    console.log(reviewRes.rows[0]);
    reviews = JSON.parse(JSON.stringify(reviewRes.rows[0]));

    const salesTrend = Prisma.sql`
      SELECT 
        SUM(price) AS price, date_trunc('month', "from") as month
      FROM "Booking" 
      WHERE paid=true
      GROUP BY month
      ORDER BY month
    `;

    const salesRes = await client.query(salesTrend);
    console.log(salesRes.rows[0]);
    reviews = JSON.parse(JSON.stringify(salesRes.rows[0]));

    client.release();
  } catch (err) {
    console.log(err.stack);
  }

  // const res = await client.query(`select * from 'Booking';`);

  // console.log("res.rows[]0", res.rows[0]);
  return {
    props: {
      bookings,
      reviews,
    },
  };
}
