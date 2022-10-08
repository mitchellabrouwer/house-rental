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

    let bookings = 0;
    while (bookings < 10) {
      const startDate = date;
      const numberOfDaysStayed = faker.datatype.number({ min: 2, max: 10 });
      let endDate = new Date();
      endDate = new Date(
        endDate.setDate(endDate.getDate() + numberOfDaysStayed)
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

  if (req.body.task === "add fake reviews") {
    let count = 0;
    while (count < 10) {
      // await prisma.review.create({
      //   data: {
      //     name: faker.word.noun().toLowerCase(),
      //     // description: faker.lorem.paragraph(1).toLowerCase(),
      //   },
      // });
      count += 1;
    }
  }

  if (req.body.task === "clean_database") {
    await prisma.booking.deleteMany({});
    await prisma.review.deleteMany({});
  }

  return res.end();
}
