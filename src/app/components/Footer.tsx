import Link from 'next/link';
import { FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Explore Beyond The Map</h3>
            <p className="text-gray-400">
              Your trusted partner for unforgettable adventures and travel experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-white transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-gray-400" />
                <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">
                +91 9328891173
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-400" />
                <p className="text-gray-400 hover:text-white transition-colors">
                ahmedabadadventureclub@gmail.com
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ">
              <FaInstagram className="text-gray-400 w-6 h-6" />
              <a
                href="https://www.instagram.com/ahmedabadadventureclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Ahmedabad Adventure Club
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Explore Beyond The Map. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 