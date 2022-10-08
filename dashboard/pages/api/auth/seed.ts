/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-await-in-loop */
import { faker } from "@faker-js/faker";
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.end;
  }

  if (req.body.task === "add_fake_bookings") {
    let count = 0;
    while (count < 10) {
      await prisma.booking.create({
        data: {
          name: faker.word.noun().toLowerCase(),
          description: faker.lorem.paragraph(1).toLowerCase(),
        },
      });
      count += 1;
    }
  }

  if (req.body.task === "add fake reviews") {
    let count = 0;
    while (count < 10) {
      await prisma.subreddit.create({
        data: {
          name: faker.word.noun().toLowerCase(),
          description: faker.lorem.paragraph(1).toLowerCase(),
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
