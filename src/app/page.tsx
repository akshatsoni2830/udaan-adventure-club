"use client";

import { useEffect, useState } from 'react';
import AutoSlider from "@/app/components/AutoSlider";

interface PackageItem {
  id: number;
  title: string;
  images: string[];
}

interface DestinationItem {
  id: number;
  title: string;
  images: string[];
}

export default function Home() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages from API
        const packagesResponse = await fetch('/api/packages');
        if (!packagesResponse.ok) {
          throw new Error('Failed to fetch packages');
        }
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.packages || []);

        // Fetch destinations from API
        const destinationsResponse = await fetch('/api/destinations');
        if (!destinationsResponse.ok) {
          throw new Error('Failed to fetch destinations');
        }
        const destinationsData = await destinationsResponse.json();
        setDestinations(destinationsData.destinations || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="bg-gray-50">
        {/* Hero Section with Video Background */}
        <section className="relative h-[75vh] flex items-center justify-center overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
          >
            <source src="/EG.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay for better text visibility */}
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Explore Beyond The Map 
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium tracking-wide">
              Find Your Next Adventure In Nature
            </p>
          </div>
        </section>

        {/* Tour Packages */}
        <section id="packages" className="p-6 sm:p-12 mb-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Tour Packages</h2>
          {packages.length > 0 ? (
            <AutoSlider 
              items={packages.map(pkg => ({
                id: pkg.id,
                title: pkg.title,
                img: pkg.images[0] || '/default-package.jpg'
              }))} 
              type="package" 
            />
          ) : (
            <p className="text-gray-600">No packages available at the moment.</p>
          )}
        </section>

        {/* Destinations */}
        <section id="destinations" className="p-6 sm:p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Popular Destinations</h2>
          {destinations.length > 0 ? (
            <AutoSlider 
              items={destinations.map(dest => ({
                id: dest.id,
                name: dest.title,
                img: dest.images[0] || '/default-destination.jpg'
              }))} 
              type="destination" 
            />
          ) : (
            <p className="text-gray-600">No destinations available at the moment.</p>
          )}
        </section>
      </main>
    </>
  );
}