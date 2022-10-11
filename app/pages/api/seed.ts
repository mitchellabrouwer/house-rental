/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.end;
  }

  if (req.body.task === "add_fake_bookings") {
    let date = new Date();
    // eslint-disable-next-line no-debugger
    let bookings = 0;

    debugger;
    while (bookings < 200) {
      const startDate = date;
      const numberOfDaysStayed = faker.datatype.number({ min: 2, max: 10 });
      const endDate = new Date(
        startDate.setDate(startDate.getDate() + numberOfDaysStayed)
      );
      date = new Date(endDate);

      await prisma.booking.create({
        data: {
          from: startDate,
          to: endDate,
          price: faker.datatype.number({ min: 20, max: 1000 }),
          pet: faker.datatype.boolean(),
          guests: faker.datatype.number({ min: 1, max: 10 }),
          email: faker.internet.email(),
          paid: true,
        },
      });
      bookings += 1;
    }
  }

  console.log("req.body.task", req.body.task);
  if (req.body.task === "add_fake_reviews") {
    const bookings = await prisma.booking.findMany();

    const getRandomBooking = () => {
      const randomIndex = Math.floor(Math.random() * bookings.length);
      return bookings[randomIndex];
    };

    let count = 0;
    while (count < 100) {
      await prisma.review.create({
        data: {
          rating: faker.datatype.number({ min: 1, max: 5 }),
          comment: faker.lorem.paragraph(),
          name: faker.name.firstName(),
          booking: { connect: { id: getRandomBooking().id } },
        },
      });
      count += 1;
    }
  }

  if (req.body.task === "clean_database") {
    await prisma.booking.deleteMany({});
    await prisma.review.deleteMany({});
  }

  return res.end();
}
