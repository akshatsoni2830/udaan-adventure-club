"use client"
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [showLogo, setShowLogo] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white text-gray-800 shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          {showLogo && (
            <Image
              src="/logo.png"
              alt="Ahmedabad Adventure Club"
              width={70}
              height={70}
              className="h-20 w-auto"
              onError={() => setShowLogo(false)}
            />
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8">
          <Link 
            href="/services" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg tracking-wide"
          >
            Services
          </Link>
          <Link 
            href="/#packages" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg tracking-wide"
          >
            Packages
          </Link>
          <Link 
            href="/#destinations" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg tracking-wide"
          >
            Destinations
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg tracking-wide"
          >
            Contact Us
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <nav
          className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 flex-col py-4 px-4 shadow-lg`}
        >
          <Link 
            href="/services" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            href="/#packages" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Packages
          </Link>
          <Link 
            href="/#destinations" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Destinations
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
