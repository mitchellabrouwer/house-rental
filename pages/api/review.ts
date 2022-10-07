import prisma from "../../lib/prisma";

export default async (req, res) => {
  // if (req.method === "GET") {
  //   //
  // }

  console.log("hit review endpoint");

  console.log("req.method", req.method);
  if (req.method === "POST") {
    console.log("in post");
    await prisma.review.upsert({
      create: {
        booking: { connect: { id: req.body.bookingId } },
        rating: req.body.rating,
        comment: req.body.comment,
        name: req.body.name,
      },
      update: {
        booking: { connect: { id: req.body.bookingId } },
        rating: req.body.rating,
        comment: req.body.comment,
        name: req.body.name,
      },
      where: {
        bookingId: req.body.bookingId,
      },
    });
    return res.json({ review: true });
  }
  return res.status(405).end();
};
