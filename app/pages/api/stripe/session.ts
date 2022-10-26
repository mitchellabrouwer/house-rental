import { totalCostOfStay } from "../../../lib/cost";
import prisma from "../../../lib/prisma";
import { stripe } from "./stripe";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const amount =
    totalCostOfStay(new Date(req.body.from), new Date(req.body.to)) * 100;

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `purchase nights from ${new Date(
              req.body.from
            ).toDateString()} to ${new Date(req.body.to).toDateString()}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    success_url: `${process.env.BASE_URL}/success`,
    cancel_url: `${process.env.BASE_URL}/calendar`,
  });

  await prisma.booking.create({
    data: {
      price: amount,
      sessionId: stripeSession.id,
      from: req.body.from,
      to: req.body.to,
      pet: req.body.pet,
      guests: req.body.guests,
    },
  });

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  return res.end(
    JSON.stringify({
      status: "success",
      sessionId: stripeSession.id,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    })
  );
};
