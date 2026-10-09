
"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiApple, SiGoogleplay } from "react-icons/si";

const customerCare = [
  { name: "Help Center", href: "/help" },
  { name: "How to Buy", href: "/help" },
  { name: "Returns & Refunds", href: "/orders" },
  { name: "Contact Us", href: "/help" },
];

const aboutLinks = [
  { name: "About Us", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Terms & Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        {/* Customer Care */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Customer Care
          </h3>

          <ul className="space-y-3">
            {customerCare.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors duration-200 hover:text-pink-400"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            My-App
          </h3>

          <ul className="space-y-3">
            {aboutLinks.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-sm transition-colors duration-200 hover:text-pink-400"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get the App */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Get the App
          </h3>

          <p className="mb-5 text-sm leading-6 text-gray-400">
            Download our mobile app for a better experience.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="App Store"
              className="text-white transition duration-200 hover:scale-110 hover:text-pink-400"
            >
              <SiApple size={38} />
            </a>

            <a
              href="#"
              aria-label="Google Play"
              className="text-white transition duration-200 hover:scale-110 hover:text-pink-400"
            >
              <SiGoogleplay size={34} />
            </a>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-5 font-semibold text-white">
            Support
          </h3>

          <p className="text-sm text-gray-300">
            support@myapp.com
          </p>

          <p className="mb-5 text-sm text-gray-300">
            +977-9800000000
          </p>

          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-200 transition duration-200 hover:bg-gray-700 hover:text-pink-400"
            >
              <FaFacebook size={17} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-200 transition duration-200 hover:bg-gray-700 hover:text-pink-400"
            >
              <FaInstagram size={17} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-200 transition duration-200 hover:bg-gray-700 hover:text-pink-400"
            >
              <FaYoutube size={17} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-gray-400 md:flex-row">
          <p>© 2026 My-App. All rights reserved.</p>

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

