/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isDaySelectable } from "../lib/dates";

export default function Calendar() {
  return (
    <div>
      <Head>
        <title>Rental Apartment</title>
        <meta name="description" content="Rental Apartment Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
                        ⬅ Back to the house details
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
        <p className="my-10 text-center text-2xl font-bold">
          Availability and braces per night
        </p>

        <div className="availability-calendar flex justify-center pt-6">
          <DayPicker
            components={{
              DayContent: (props) => (
                <div
                  className={`relative text-right ${
                    !isDaySelectable(props.date) && "text-gray-500"
                  }`}
                >
                  {props.date.getDate()}
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
