"use client";

import { useEffect, useState } from 'react';
import AutoSlider from "@/app/components/AutoSlider";
import * as XLSX from 'xlsx';

interface PackageItem {
  ID: number;
  Title: string;
  Duration: string;
  "Departure Cities": string;
  "Fixed Departures": string;
  "Cost Details": string;
  Inclusions: string;
  Notes: string;
  "Items to Carry": string;
  "Payment Terms": string;
  "Cancellation Terms": string;
  Images: string;
}

// Static destinations data
const destinations = [
  { id: 1, name: "Ladakh", img: "/eg7.jpg" },
  { id: 2, name: "Spiti Valley", img: "/eg8.jpg" },
  { id: 3, name: "Meghalaya", img: "/eg9.jpg" },
  { id: 4, name: "Rajasthan", img: "/desert.jpg" },
  { id: 5, name: "Kerala", img: "/kerela.jpg" },
];

export default function Home() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('/packages_details.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<PackageItem>(worksheet);
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
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
          <AutoSlider 
            items={packages.map(pkg => ({
              id: pkg.ID,
              title: pkg.Title,
              img: (pkg.Images || '').split(', ')[0] || '/default-package.jpg'
            }))} 
            type="package" 
          />
        </section>

        {/* Destinations */}
        <section id="destinations" className="p-6 sm:p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Popular Destinations</h2>
          <AutoSlider 
            items={destinations} 
            type="destination" 
          />
        </section>
      </main>
    </>
  );
}