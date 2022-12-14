/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getBookedDates } from "../lib/bookings";
import { getCost, totalCostOfStay } from "../lib/cost";
import {
  addDayToRange,
  getBlockedDates,
  getDatesBetweenDates,
  isDaySelectable,
  numberOfNightsBetweenDates,
} from "../lib/dates";
import prisma from "../lib/prisma";

export default function Calendar({ bookedDates }) {
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [guests, setGuests] = useState(0);
  const [pet, setPet] = useState(false);

  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setDate(sixMonthsFromNow.getDate() + 30 * 6);

  const handleDayClick = (day) => {
    const range = addDayToRange(day, { from, to });

    if (!range.to) {
      if (!isDaySelectable(range.from, bookedDates)) {
        alert("This date cannot be selected");
        return;
      }
      range.to = range.from;
    }

    if (range.to && range.from) {
      if (!isDaySelectable(range.to, bookedDates)) {
        alert("The in date cannot be selected");
        return;
      }
    }

    const daysInBetween = getDatesBetweenDates(range.from, range.to);

    // eslint-disable-next-line no-restricted-syntax
    for (const dayInBetween of daysInBetween) {
      if (!isDaySelectable(dayInBetween, bookedDates)) {
        alert("Sum days between those 2 dates cannot be selected");
        return;
      }
    }

    setFrom(range.from);
    setTo(range.to);

    setNumberOfNights(numberOfNightsBetweenDates(range.from, range.to) + 1);
    setTotalCost(totalCostOfStay(range.from, range.to));
  };

  const handleBookingClick = async () => {
    const res = await fetch("/api/stripe/session", {
      body: JSON.stringify({
        from,
        to,
        guests,
        pet,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await res.json();
    const { sessionId } = data;
    const { stripePublicKey } = data;
    // update to code required
    // @ts-ignore
    // eslint-disable-next-line no-undef
    const stripe = Stripe(stripePublicKey);
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <Head>
        <title>Rental Apartment</title>
        <meta name="description" content="Rental Apartment Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://js.stripe.com/v3/"></Script>

      <div className="relative overflow-hidden">
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>
          <div className="">
            <div className="relative shadow-xl  sm:overflow-hidden">
              <div className="absolute inset-0">
                <img className="h-full w-full object-cover" src="/img/1.jpeg" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 mix-blend-multiply"></div>
              </div>
              <div className="relative bg-gray-800/80 px-4 py-16 sm:px-6 sm:py-24 lg:py-32  lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  A Charming Old House
                  <span className="block text-gray-300">
                    on the Italian Alps
                  </span>
                </h1>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0">
                    <Link href="/">
                      <a className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-blue-50 sm:px-8">
                        ??? Back to the house details
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col">
        <p className="my-5 text-center text-2xl font-bold">
          Availability and prices per night
        </p>
        <div className="availability-calendar flex w-full justify-center pt-6">
          <DayPicker
            selected={[from, { from, to }]}
            mode="range"
            className="rounded-lg border px-10 py-5"
            onDayClick={handleDayClick}
            disabled={[
              ...getBlockedDates(),
              ...bookedDates,
              {
                from: new Date("0000"),
                to: yesterday,
              },
              {
                from: sixMonthsFromNow,
                to: new Date("4000"),
              },
            ]}
            components={{
              DayContent: ({ date }) => (
                <div
                  className={`relative ${
                    !isDaySelectable(date, bookedDates) && "text-gray-500"
                  }`}
                >
                  <div>{date.getDate()}</div>
                  {isDaySelectable(date, bookedDates) && (
                    <div>
                      <span className="rounded-md bg-white px-1 font-bold text-black">
                        ${getCost(date)}
                      </span>
                    </div>
                  )}
                </div>
              ),
            }}
          />
        </div>

        <p className="mt-2 text-center font-extrabold">
          {totalCost > 0 && `Total cost: $${totalCost}`}
        </p>
        <p className="mt-2 text-center italic">
          {numberOfNights > 0 && `Stay for ${numberOfNights} nights`}
        </p>
        <p className="text-center">
          {from && to && (
            <button
              type="button"
              className="mt-4 rounded-md border px-2 py-1"
              onClick={() => {
                setFrom(null);
                setTo(null);
                setNumberOfNights(0);
                setTotalCost(0);
              }}
            >
              Reset
            </button>
          )}
        </p>
        <div className="mt-2 text-center">
          <label
            htmlFor="visitors"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Number of guests
            <input
              type="number"
              id="visitors"
              className="ml-4 w-20 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder=""
              onChange={() => setGuests(guests + 1)}
              required
            />
          </label>
          <label
            htmlFor="pet-checkbox"
            className="mb-19 ml-0 block text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Do you have pets?
            <input
              id="pet-checkbox"
              type="checkbox"
              checked={pet}
              onChange={() => setPet(!pet)}
              className="relative ml-2 h-10 w-10 rounded border-gray-300 bg-gray-100 align-middle text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
            />
          </label>
        </div>
        {numberOfNights > 0 && (
          <button
            className="mx-auto mt-5 w-40 rounded-md border border-transparent bg-green-500 px-4 py-3 text-base font-medium text-white shadow-sm  sm:px-8"
            type="button"
            onClick={handleBookingClick}
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  let bookedDates = await getBookedDates(prisma);
  bookedDates = JSON.parse(JSON.stringify(bookedDates));

  return {
    props: {
      bookedDates,
    },
  };
}
