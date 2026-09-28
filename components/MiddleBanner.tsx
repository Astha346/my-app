type PromoItem = {
  title: string;
  desc: string;
  img: string;
};

const promoData: PromoItem[] = [
  {
    title: "Immersive Sound",
    desc: "Crystal-clear audio headphones.",
    img: "/images/person1.jpg",
  },
  {
    title: "Stay Connected",
    desc: "Compact and stylish for every occasion.",
    img: "/images/person2.jpg",
  },
  {
    title: "Power in Every Pixel",
    desc: "Shop the latest laptops for work, gaming, and more.",
    img: "/images/person3.jpg",
  },
];

export default function MiddleBanner() {
  return (
    <section className="bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Shop Our Picks
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Featured Products
          </h2>

          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-black" />
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {promoData.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden sm:h-80">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm text-white/85">
                    {item.desc}
                  </p>

                  <button
                    type="button"
                    className="mt-4 inline-flex items-center rounded-lg bg-white px-4 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}