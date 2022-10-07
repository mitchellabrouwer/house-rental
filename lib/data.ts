import { PrismaClient } from "@prisma/client";

export const getReviews = async (prisma: PrismaClient) => {
  const reviews = await prisma.review.findMany({
    include: {
      booking: true,
    },
  });

  console.log("reviews", reviews);
  return reviews;
};
