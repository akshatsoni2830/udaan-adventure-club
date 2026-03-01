"use client";

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContactForm from '@/app/components/ContactForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CostPerPerson {
  description: string;
  price: string;
}

interface ItemDetails {
  id: number;
  title: string;
  duration: string;
  departureCities: string[];
  fixedDepartures: string[];
  costDetails: CostPerPerson[];
  inclusions: string[];
  notes: string[];
  itemsToCarry: string[];
  paymentTerms: string[];
  cancellationTerms: string[];
  images: string[];
}

export default function ItemDetail({ params }: { params: Promise<{ type: string; id: string }> }) {
  const resolvedParams = use(params);
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!resolvedParams || !resolvedParams.type || !resolvedParams.id) {
          console.error('Missing required parameters:', resolvedParams);
          setError('Invalid request parameters');
          setLoading(false);
          return;
        }

        const parsedId = parseInt(resolvedParams.id);
        if (isNaN(parsedId)) {
          console.error('Invalid ID:', resolvedParams.id);
          setError('Invalid ID format');
          setLoading(false);
          return;
        }

        // Fetch from API based on type
        const endpoint = resolvedParams.type === 'destination' 
          ? `/api/destinations/${parsedId}`
          : `/api/packages/${parsedId}`;

        const response = await fetch(endpoint);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Item not found');
          } else {
            setError('Failed to load data');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        const fetchedItem = resolvedParams.type === 'destination' ? data.destination : data.package;

        if (!fetchedItem) {
          setError('Item not found');
          setLoading(false);
          return;
        }

        // For destinations, add default values for missing fields
        if (resolvedParams.type === 'destination') {
          setItem({
            ...fetchedItem,
            duration: '3-7 days',
            departureCities: ['Ahmedabad', 'Mumbai', 'Delhi'],
            fixedDepartures: ['Every Friday', 'Every Sunday'],
            costDetails: [
              { description: 'Basic Package', price: '₹15,000' },
              { description: 'Premium Package', price: '₹25,000' }
            ],
            inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide'],
            notes: ['Weather dependent', 'Physical fitness required'],
            itemsToCarry: ['Warm clothes', 'Camera', 'Personal items'],
            paymentTerms: ['50% advance', 'Balance on arrival'],
            cancellationTerms: ['7 days notice required']
          });
        } else {
          setItem(fetchedItem);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Item not found'}</h1>
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
            loop={item.images.length > 1}
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
            {item.costDetails[0]?.price || "Contact for pricing"}
          </span>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-black">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Package Inclusions</h2>
              <ul className="space-y-2">
                {item.inclusions.map((inclusion, index) => (
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
              <p className="text-gray-600">{item.departureCities.join(", ") || "Not specified"}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Fixed Departure Dates</h2>
              <ul className="space-y-2">
                {item.fixedDepartures.map((date, index) => (
                  <li key={index} className="text-gray-600">{date}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cost Details</h2>
              <ul className="space-y-2">
                {item.costDetails.map((cost, index) => (
                  <li key={index} className="text-gray-600">{cost.description}: {cost.price}</li>
                ))}
              </ul>
            </div>

            {item.notes.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4">Notes</h2>
                <ul className="space-y-2">
                  {item.notes.map((note, index) => (
                    <li key={index} className="text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.itemsToCarry.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4">Items to Carry</h2>
                <ul className="space-y-2">
                  {item.itemsToCarry.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.paymentTerms.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
                <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
                <ul className="space-y-2">
                  {item.paymentTerms.map((term, index) => (
                    <li key={index} className="text-gray-600">{term}</li>
                  ))}
                </ul>
              </div>
            )}

            {item.cancellationTerms.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Cancellation Terms</h2>
                <ul className="space-y-2">
                  {item.cancellationTerms.map((term, index) => (
                    <li key={index} className="text-gray-600">{term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-6 hidden md:block">
                <span className="text-3xl font-bold text-blue-600">
                  {item.costDetails[0]?.price || "Contact for pricing"}
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
