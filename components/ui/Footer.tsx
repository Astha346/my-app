"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import {
  SiApple,
  SiGoogleplay,
} from "react-icons/si";

const customerCare = [
  {
    name: "Help Center",
    href: "/help",
  },
  {
    name: "How to Buy",
    href: "/help",
  },
  {
    name: "Returns & Refunds",
    href: "/orders",
  },
  {
    name: "Contact Us",
    href: "/help",
  },
];

const aboutLinks = [
  {
    name: "About Us",
    href: "#",
  },
  {
    name: "Careers",
    href: "#",
  },
  {
    name: "Terms & Conditions",
    href: "#",
  },
  {
    name: "Privacy Policy",
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">

      {/* =========================
          MAIN FOOTER
      ========================== */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">

        {/* =========================
            CUSTOMER CARE
        ========================== */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Customer Care
          </h3>

          <ul className="space-y-3">
            {customerCare.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* =========================
            ABOUT
        ========================== */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            My-App
          </h3>

          <ul className="space-y-3">
            {aboutLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* =========================
            GET THE APP
        ========================== */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Get the App
          </h3>

          <p className="mb-5 text-sm leading-6 text-gray-400">
            Download our mobile app for a better experience.
          </p>

          {/* ONLY LOGOS */}
          <div className="flex items-center gap-5">
            {/* Apple */}
            <a
              href="#"
              aria-label="App Store"
              className="text-white transition duration-200 hover:scale-110 hover:text-gray-300"
            >
              <SiApple size={38} />
            </a>

            {/* Google Play */}
            <a
              href="#"
              aria-label="Google Play"
              className="text-white transition duration-200 hover:scale-110 hover:text-gray-300"
            >
              <SiGoogleplay size={34} />
            </a>
          </div>
        </div>

        {/* =========================
            SUPPORT + SOCIAL
        ========================== */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Support
          </h3>

          <p className="text-sm text-gray-400">
            support@myapp.com
          </p>

          <p className="mb-5 text-sm text-gray-400">
            +977-9800000000
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-3">

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <FaFacebook size={17} />
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <FaInstagram size={17} />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <FaYoutube size={17} />
            </a>

          </div>
        </div>
      </div>

      {/* =========================
          BOTTOM BAR
      ========================== */}
      <div className="border-t border-white/10 bg-[#0b1220]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-gray-400 md:flex-row">

          <p>
            © 2026 My-App. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <span>🇳🇵 Nepal</span>
            <span>🇵🇰 Pakistan</span>
            <span>🇧🇩 Bangladesh</span>
            <span>🇱🇰 Sri Lanka</span>
          </div>

        </div>
      </div>

    </footer>
  );
}