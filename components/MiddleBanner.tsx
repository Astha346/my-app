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
    desc: "Compact and stylish  for every occasion.",
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
    <div className="px-6 py-12">
      <h2 className="text-center text-2xl font-semibold mb-2">
        Featured Products
      </h2>

      <div className="w-16 h-1 bg-orange-500 mx-auto mb-8"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promoData.map((item, index) => (
          <a
            
            key={index}
            className="relative group overflow-hidden rounded-lg"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-[300px] object-cover transition duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>

              <button className="mt-3 bg-orange-500 px-3 py-1 text-sm rounded w-fit">
                Buy now
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}