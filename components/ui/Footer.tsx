"use client";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const customerCare = [
  "Help Center",
  "How to Buy",
  "Returns & Refunds",
  "Contact Us",
];

const aboutLinks = [
  "About Us",
  "Careers",
  "Terms & Conditions",
  "Privacy Policy",
];

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Customer Care</h3>
          <ul className="space-y-3">
            {customerCare.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-5 text-white">My-App</h3>
          <ul className="space-y-3">
            {aboutLinks.map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white transition text-sm">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* App */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Get the App</h3>
          <p className="text-sm text-gray-400 mb-5">
            Download our mobile app for better experience
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="#"
              className="bg-white text-black py-2 rounded-md text-center hover:bg-gray-200 transition text-sm font-medium"
            >
              App Store
            </a>
            <a
              href="#"
              className="bg-white text-black py-2 rounded-md text-center hover:bg-gray-200 transition text-sm font-medium"
            >
              Google Play
            </a>
          </div>
        </div>

        {/* Support + Social */}
        <div>
          <h3 className="font-semibold mb-5 text-white">Support</h3>

          <p className="text-sm text-gray-400">support@myapp.com</p>
          <p className="text-sm text-gray-400 mb-5">+977-9800000000</p>

          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaFacebook size={18} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 bg-[#0b1220]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-3">
          <p>© 2026 My-App. All rights reserved.</p>

          <div className="flex gap-3">
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