"use client";

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/app/components/ContactForm';
import * as XLSX from 'xlsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface CostPerPerson {
  description: string;
  price: string;
}

interface ExcelItem {
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

interface ItemDetails {
  id: number;
  title: string;
  duration: string;
  departure_cities: string[];
  fixed_departure_dates: string[];
  cost_per_person: CostPerPerson[];
  package_inclusions: string[];
  notes: string[];
  items_to_carry: string[];
  payment_terms: string[];
  cancellation_terms: string[];
  images: string[];
}

export default function ItemDetail({ params }: { params: Promise<{ type: string; id: string }> }) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!resolvedParams || !resolvedParams.type || !resolvedParams.id) {
          console.error('Missing required parameters:', resolvedParams);
          setItem(null);
          setLoading(false);
          return;
        }

        const parsedId = parseInt(resolvedParams.id);
        if (isNaN(parsedId)) {
          console.error('Invalid ID:', resolvedParams.id);
          setItem(null);
          setLoading(false);
          return;
        }

        if (resolvedParams.type === 'destination') {
          // Handle destinations as static data since they don't have detailed Excel files
          const staticDestinations = [
            { ID: 1, Title: "Ladakh", Description: "High-altitude desert region with stunning landscapes", Images: "/eg7.jpg" },
            { ID: 2, Title: "Spiti Valley", Description: "Remote mountain valley with ancient monasteries", Images: "/eg8.jpg" },
            { ID: 3, Title: "Meghalaya", Description: "Lush green hills and living root bridges", Images: "/eg9.jpg" },
            { ID: 4, Title: "Rajasthan", Description: "Royal heritage and desert landscapes", Images: "/desert.jpg" },
            { ID: 5, Title: "Kerala", Description: "Backwaters and tropical paradise", Images: "/kerela.jpg" },
          ];
          
          const foundItem = staticDestinations.find((item) => item.ID === parsedId);
          if (!foundItem) {
            console.error('No destination found for:', parsedId);
            setItem(null);
            setLoading(false);
            return;
          }

          const itemDetails: ItemDetails = {
            id: foundItem.ID,
            title: foundItem.Title || '',
            duration: '3-7 days',
            departure_cities: ['Ahmedabad', 'Mumbai', 'Delhi'],
            fixed_departure_dates: ['Every Friday', 'Every Sunday'],
            cost_per_person: [
              { description: 'Basic Package', price: '₹15,000' },
              { description: 'Premium Package', price: '₹25,000' }
            ],
            package_inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide'],
            notes: ['Weather dependent', 'Physical fitness required'],
            items_to_carry: ['Warm clothes', 'Camera', 'Personal items'],
            payment_terms: ['50% advance', 'Balance on arrival'],
            cancellation_terms: ['7 days notice required'],
            images: [foundItem.Images]
          };

          setItem(itemDetails);
          setLoading(false);
          return;
        }

        const excelFile = 'packages_summary.xlsx';
        const response = await fetch(`/${excelFile}`);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json<ExcelItem>(worksheet);

        const foundItem = data.find((item) => item.ID === parsedId);

        if (!foundItem) {
          console.error('No details found for:', { type: resolvedParams.type, id: parsedId });
          setItem(null);
          setLoading(false);
          return;
        }

        const costPerPerson: CostPerPerson[] = (foundItem["Cost Details"] || '')
          .split('; ')
          .filter(cost => cost.trim())
          .map(cost => {
            const [description, price] = cost.split(': ');
            return { description: description || '', price: price || '' };
          });

        const itemDetails: ItemDetails = {
          id: foundItem.ID,
          title: foundItem.Title || '',
          duration: foundItem.Duration || '',
          departure_cities: (foundItem["Departure Cities"] || '').split(', ').filter(city => city.trim()),
          fixed_departure_dates: (foundItem["Fixed Departures"] || '').split(', ').filter(date => date.trim()),
          cost_per_person: costPerPerson,
          package_inclusions: (foundItem.Inclusions || '').split('; ').filter(inclusion => inclusion.trim()),
          notes: (foundItem.Notes || '').split('; ').filter(note => note.trim()),
          items_to_carry: (foundItem["Items to Carry"] || '').split('; ').filter(item => item.trim()),
          payment_terms: (foundItem["Payment Terms"] || '').split('; ').filter(term => term.trim()),
          cancellation_terms: (foundItem["Cancellation Terms"] || '').split('; ').filter(term => term.trim()),
          images: (foundItem.Images || '').split(', ').filter(img => img.trim())
        };

        setItem(itemDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setItem(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
          <p className="text-gray-600 mb-4">We couldn&apos;t find the requested package or destination.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Hero Carousel Section */}
        <div className="relative h-[500px] rounded-2xl overflow-hidden mb-8">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            className="h-full"
          >
            {item.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-[500px]">
                  <Image
                    src={img}
                    alt={`${item.title} Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 p-8 text-white">
                      <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
                      <p className="text-xl">{item.duration}</p>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile Price Display */}
        <div className="md:hidden bg-white rounded-2xl p-6 shadow-sm mb-8 text-center">
          <span className="text-3xl font-bold text-blue-600">
            {item.cost_per_person[0]?.price || "Contact for pricing"}
          </span>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Package Inclusions</h2>
              <ul className="space-y-2">
                {item.package_inclusions.map((inclusion, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Departure Cities</h2>
              <p className="text-gray-600">{item.departure_cities.join(", ") || "Not specified"}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Fixed Departure Dates</h2>
              <ul className="space-y-2">
                {item.fixed_departure_dates.map((date, index) => (
                  <li key={index} className="text-gray-600">{date}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cost Details</h2>
              <ul className="space-y-2">
                {item.cost_per_person.map((cost, index) => (
                  <li key={index} className="text-gray-600">{cost.description}: {cost.price}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Notes</h2>
              <ul className="space-y-2">
                {item.notes.map((note, index) => (
                  <li key={index} className="text-gray-600">{note}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Items to Carry</h2>
              <ul className="space-y-2">
                {item.items_to_carry.map((item, index) => (
                  <li key={index} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
              <ul className="space-y-2">
                {item.payment_terms.map((term, index) => (
                  <li key={index} className="text-gray-600">{term}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Cancellation Terms</h2>
              <ul className="space-y-2">
                {item.cancellation_terms.map((term, index) => (
                  <li key={index} className="text-gray-600">{term}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-8">
              <div className="text-center mb-6 hidden md:block">
                <span className="text-3xl font-bold text-blue-600">
                  {item.cost_per_person[0]?.price || "Contact for pricing"}
                </span>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
