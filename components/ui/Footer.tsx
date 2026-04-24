"use client";

import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f5] text-gray-700">

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Customer Care */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Customer Care</h3>
          <ul className="space-y-2">
            {["Help Center", "How to Buy", "Returns & Refunds", "Contact Us"].map((item) => (
              <li
                key={item}
                className="hover:text-orange-500 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">My-App</h3>
          <ul className="space-y-2">
            {["About Us", "Careers", "Terms & Conditions", "Privacy Policy"].map((item) => (
              <li
                key={item}
                className="hover:text-orange-500 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* App */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Get the App</h3>
          <p className="text-sm mb-4">Download our mobile app for best experience</p>

          <div className="flex flex-col gap-3">
            <button className="bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              App Store
            </button>
            <button className="bg-black text-white py-2 rounded hover:bg-gray-800 transition">
              Google Play
            </button>
          </div>
        </div>

        {/* Support + Social */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Support</h3>

          <p className="text-sm">support@myapp.com</p>
          <p className="text-sm mb-4">+977-9800000000</p>

          <div className="flex gap-4 mt-3">
            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:scale-110 transition text-blue-600"
            >
              <FaFacebook size={20} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              className="hover:scale-110 transition text-pink-500"
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              className="hover:scale-110 transition text-red-600"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t bg-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">

          <p>© 2026 My-App. All rights reserved.</p>

          <div className="flex flex-wrap gap-3 text-xs">
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