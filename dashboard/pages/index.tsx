import { Prisma } from "@prisma/client";
import Head from "next/head";
import Chart from "../components/Chart";
import pool from "../lib/pg";

export default function Home({ bookings, reviews, sales }) {
  return (
    <div>
      <Head>
        <title />
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className=" text-white-800 mt-4 mb-2 text-center text-4xl font-normal leading-normal">
        House dashboard
      </h1>
      <ul className="m-auto my-5 max-w-md space-y-2 rounded-2xl bg-white p-2 text-center text-black">
        <li>
          <strong>{bookings.bookings}</strong> bookings
        </li>
        <li>
          <strong>{bookings.guests}</strong> guests
        </li>{" "}
        <li>
          <strong>
            {reviews.average
              ? `${Math.round(+reviews.average)}/5`
              : "No reviews yet"}
          </strong>
          {reviews.average && " review average"}
        </li>
        <li>
          <strong>{`$${Number(bookings.earnings)}`}</strong> earnt
        </li>
        <li></li>
      </ul>
      <Chart title="Sales by month" data={sales} />
    </div>
  );
}

export async function getServerSideProps(context) {
  let bookings;
  let reviews;
  let sales;

  try {
    const client = await pool.connect();

    const bookingStats = Prisma.sql`
      SELECT 
        COUNT (*) AS "bookings",
        SUM ("guests") AS "guests",
        SUM ("price") AS "earnings"
      FROM "Booking" 
      WHERE paid=true`;

    const bookingRes = await client.query(bookingStats);
    console.log(bookingRes.rows[0]);
    bookings = JSON.parse(JSON.stringify(bookingRes.rows[0]));

    const reviewStats = Prisma.sql`
      SELECT 
        AVG ("rating") AS "average"
      FROM "Review" 
    `;

    const reviewRes = await client.query(reviewStats);
    reviews = JSON.parse(JSON.stringify(reviewRes.rows[0]));

    const salesTrend = Prisma.sql`
      SELECT 
        SUM(price) AS sales, date_trunc('month', "from") as month
      FROM "Booking" 
      WHERE paid=true
      GROUP BY month
      ORDER BY month
    `;

    const salesRes = await client.query(salesTrend);
    const salesParsed = salesRes.rows.map((period) => {
      return {
        value: Math.round(Number(period.sales)),
        label: period.month,
      };
    });
    sales = JSON.parse(JSON.stringify(salesParsed));

    client.release();
  } catch (err) {
    console.log(err.stack);
  }

  return {
    props: {
      bookings,
      reviews,
      sales,
    },
  };
}
