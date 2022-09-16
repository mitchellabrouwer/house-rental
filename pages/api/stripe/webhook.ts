import getRawBody from "raw-body";
import sendEmail from "../../../lib/email";
import prisma from "../../../lib/prisma";
import { stripe } from "./stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"];

  const rawBody = await getRawBody(req, {
    encoding: "utf-8",
  });

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    res.writeHead(400, {
      "Content-Type": "application/json",
    });
    console.error(err.message);
    res.end(
      JSON.stringify({
        status: "success",
        message: `Webhook Error: ${err.message}`,
      })
    );
    return;
  }

  if (event.type === "checkout.session.completed") {
    const sessionId = event.data.object.id;

    const { email } = event.data.object.customer_details;
    try {
      const booking = await prisma.booking.findFirst({
        where: {
          sessionId,
        },
      });

      console.log("booking", booking);

      await prisma.booking.updateMany({
        data: {
          paid: true,
          sessionId: "",
          email,
        },
        where: {
          sessionId,
        },
      });

      sendEmail(
        "you@youremail.com",
        "New booking",
        `${email} booked from ${new Date(
          booking.from
        ).toDateString()} to ${new Date(booking.to).toDateString()}`
      );

      sendEmail(
        email,
        "Thanks for booking",
        `Your booking from ${new Date(
          booking.from
        ).toDateString()} to ${new Date(
          booking.to
        ).toDateString()} is confirmed!`
      );
    } catch (err) {
      console.error(err);
    }
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ received: true }));
};
