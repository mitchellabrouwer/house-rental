import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title />
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-white-800 mt-4 mb-2 text-center text-4xl font-normal leading-normal">
        House dashboard
      </h1>
      <ul>
        <li>total people stayed</li>
        <li>total nights stayed</li>
        <li>average rating</li>
        <li>Total Earnings</li>
        <li>Show graph of money and by month</li>
      </ul>
    </div>
  );
}
