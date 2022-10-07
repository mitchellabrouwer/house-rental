import { useRouter } from "next/router";
import { useState } from "react";
import { InputStars } from "../../components/InputStars";

export default function Review() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  console.log("rating", rating);
  return (
    <div className="flex h-screen items-center justify-center ">
      <form className=" spacing flex flex-col gap-3 rounded-md border border-white p-10">
        <h1 className="mt-0 text-center text-2xl font-medium leading-tight">
          Thank you for visiting
        </h1>
        <p className="mb-4 text-center font-medium italic leading-tight">
          Please leave a review
        </p>

        <label htmlFor="email" className="mt-3 text-center font-bold">
          Email
        </label>
        <input
          type="email"
          className="rounded-md p-2 text-black"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="email" className="mt-3 text-center font-bold">
          Name
        </label>
        <input
          type="email"
          className="rounded-md p-2 text-black"
          onChange={(event) => setName(event.target.value)}
        />

        <InputStars setRating={setRating} />

        <label htmlFor="comment" className="mt-3 text-center font-bold">
          Comment
        </label>
        <textarea
          id="comment"
          className="rounded-md p-2 text-black"
          onChange={(event) => setComment(event.target.value)}
          rows={4}
          cols={40}
        />

        <button
          type="button"
          className="mt-5 rounded-md border px-2 py-1"
          onClick={async (e) => {
            console.log("clicked");

            e.preventDefault();

            const res = await fetch("/api/review", {
              body: JSON.stringify({
                bookingId: router.query.id,
                email,
                rating,
                comment,
                name,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });

            const data = await res.json();

            console.log("data", data);
          }}
        >
          Leave review
        </button>
      </form>
    </div>
  );
}
