"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

const slides = [
{
image: "/images/pink.jpg",
title: "Summer Sale",
subtitle: "Up to 65% Off",
},
{
image: "/images/mens.jpg",
title: "New Arrivals",
subtitle: "Fresh fashion drops",
},
{
image: "/images/laptop2.jpg",
title: "Electronics Deal",
subtitle: "Best prices today",
},
];

export default function HeroSlider() {
const [index, setIndex] = useState(0);

useEffect(() => {
const interval = setInterval(() => {
setIndex((prev) => (prev + 1) % slides.length);
}, 3000);


return () => clearInterval(interval);


}, []);

return ( <section className="w-full bg-background px-3 pb-5 pt-5 text-foreground sm:px-6 lg:px-10"> <div className="relative mx-auto h-[260px] w-full max-w-[1500px] overflow-hidden rounded-2xl shadow-sm sm:h-[360px] md:h-[420px] lg:h-[480px] lg:rounded-3xl">
{/* Slides */}
{slides.map((slide, i) => (
<div
key={slide.image}
className={`absolute inset-0 transition-opacity duration-700 ${
              i === index
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
>
{/* Image */} <img
           src={slide.image}
           alt={slide.title}
           className="absolute inset-0 h-full w-full object-contai nobject-center"
         />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-5 sm:px-10 lg:px-16">
            <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm sm:mb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white sm:text-sm">
                ShopEase
              </p>
            </div>

            <h2 className="max-w-lg text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {slide.title}
            </h2>

            <p className="mt-3 text-sm font-medium text-white/90 sm:mt-4 sm:text-xl">
              {slide.subtitle}
            </p>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-xl sm:mt-6 sm:px-6 sm:py-3"
            >
              Shop Now
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    ))}

    {/* Slide Indicators */}
    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm sm:bottom-6">
      {slides.map((slide, i) => (
        <button
          key={slide.image}
          type="button"
          onClick={() => setIndex(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index ? "true" : undefined}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === index
              ? "w-8 bg-white"
              : "w-2 bg-white/60 hover:bg-white"
          }`}
        />
      ))}
    </div>
  </div>
</section>


);
}
