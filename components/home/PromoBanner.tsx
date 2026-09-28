export default function PromoBanner() {
  return (
    <section className="bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-3">
        
        {/* Laptops */}
        <div className="group relative overflow-hidden rounded-2xl bg-gray-900 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Tech Deals
            </p>

            <h3 className="text-2xl font-bold">
              Laptops
            </h3>

            <p className="mt-2 text-sm text-gray-300">
              Min. 40% Off
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Shop Now
            </button>
          </div>

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute -bottom-16 -right-4 h-36 w-36 rounded-full bg-white/5" />
        </div>

        {/* Beauty */}
        <div className="group relative overflow-hidden rounded-2xl bg-pink-50 p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-pink-500">
              Beauty Picks
            </p>

            <h3 className="text-2xl font-bold">
              Beauty
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Up to 25% Off
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              Explore
            </button>
          </div>

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-pink-200/60 transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute -bottom-16 -right-4 h-36 w-36 rounded-full bg-pink-200/40" />
        </div>

        {/* Fruits */}
        <div className="group relative overflow-hidden rounded-2xl bg-amber-50 p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
              Fresh Picks
            </p>

            <h3 className="text-2xl font-bold">
              Fruits
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Min. 65% Off
            </p>

            <button
              type="button"
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              Shop Now
            </button>
          </div>

          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/60 transition-transform duration-500 group-hover:scale-125" />
          <div className="absolute -bottom-16 -right-4 h-36 w-36 rounded-full bg-amber-200/40" />
        </div>

      </div>
    </section>
  );
}