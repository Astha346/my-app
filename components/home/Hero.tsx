"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    image: "/images/picture.jpg",
    title: "Summer Sale",
    subtitle: "Up to 65% Off",
  },
  {
    image: "/images/picture2.jpg",
    title: "New Arrivals",
    subtitle: "Fresh fashion drops",
  },
  {
    image: "/images/picture3.jpg",
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

  return (
    <div className="relative w-full h-[400px] overflow-hidden">

      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            className="w-full h-full object-cover"
          />

          <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white">
            <h2 className="text-4xl font-bold">{slide.title}</h2>
            <p className="mt-2">{slide.subtitle}</p>
          </div>
        </div>
      ))}

    </div>
  );
}