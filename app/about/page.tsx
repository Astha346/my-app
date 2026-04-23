export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">

      {/* HERO SECTION */}
      <div className="bg-gray-50 dark:bg-zinc-900 py-16">
        <div className="max-w-5xl mx-auto text-center px-6">

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            About Our Store
          </h1>

          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            We bring quality products, fast delivery, and trusted service right to your doorstep.
          </p>

        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-6">

        <div className="border rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold">🚚 Fast Delivery</h3>
          <p className="text-sm text-gray-500 mt-2">
            Quick and reliable shipping across all locations.
          </p>
        </div>

        <div className="border rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold">💳 Secure Payments</h3>
          <p className="text-sm text-gray-500 mt-2">
            Safe checkout with trusted payment methods.
          </p>
        </div>

        <div className="border rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold">🔁 Easy Returns</h3>
          <p className="text-sm text-gray-500 mt-2">
            Simple return and refund process.
          </p>
        </div>

      </div>

      {/* INFO SECTION */}
      <div className="bg-gray-50 dark:bg-zinc-900 py-14">

        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Why customers trust us
            </h2>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
              We focus on quality, affordability, and customer satisfaction.
              Every product is carefully selected to ensure the best experience.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>✔ Verified quality products</li>
              <li>✔ Fast support response</li>
              <li>✔ Secure shopping experience</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-zinc-800 border rounded-xl p-6 shadow">
            <h3 className="font-semibold text-lg">Customer Promise</h3>
            <p className="text-sm text-gray-500 mt-3">
              We ensure every order is delivered safely, on time, and with full support.
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 text-sm py-10">
        © {new Date().getFullYear()} Your Store. All rights reserved.
      </div>

    </div>
  );
}