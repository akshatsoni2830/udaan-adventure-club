"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "Rental Services",
      description: "We offer a wide range of rental services including vehicles, equipment, and gear for your travel needs. Whether you need a car for local exploration or camping equipment for your adventure, we've got you covered with well-maintained and reliable options.",
      image: "/car.png",
      features: [
        "Vehicle rentals for all types of travel",
        "Camping and outdoor equipment",
        "Professional guides and support",
        "Flexible rental durations"
      ]
    },
    {
      title: "School Picnic Packages",
      description: "Specialized packages designed for educational institutions, offering safe and enriching experiences for students. Our school picnic packages include educational tours, adventure activities, and team-building exercises.",
      image: "/school.png",
      features: [
        "Customized educational tours",
        "Safety-first approach",
        "Experienced supervisors",
        "Transportation and meals included"
      ]
    },
    {
      title: " Cabs and Hotels bookings",
      description: "Comprehensive travel solutions including comfortable cab services and carefully selected hotel accommodations. We ensure a seamless travel experience with reliable transportation and quality stays.",
      image: "/hotel.jpg",
      features: [
        "24/7 cab and bus services",
        "Verified hotel partners",
        "Competitive pricing",
        "Door-to-door service"
      ]
    },
    {
      title: "Fixed Departure Packages",
      description: "Curated travel packages designed to offer the best experiences at popular destinations. Our pre-planned packages take the hassle out of travel planning while ensuring you don't miss any must-see attractions.",
      image: "/eg1.jpg",
      features: [
        "Popular destination packages",
        "All-inclusive pricing",
        "Expertly crafted itineraries",
        "Group and solo traveler options"
      ]
    },
    {
      title: "Custom Packages",
      description: "Tailor-made travel experiences designed according to your preferences and requirements. Whether it's a romantic getaway, family vacation, or corporate retreat, we create personalized packages that match your vision.",
      image: "/eg7.jpg",
      features: [
        "Personalized itineraries",
        "Flexible scheduling",
        "Special requests accommodated",
        "Dedicated travel consultant"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600">Discover the range of travel services we offer to make your journey memorable</p>
        </div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
              <div className="w-full md:w-1/2">
                <div className="relative h-80 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-semibold text-gray-900 mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link 
                    href="/contact" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                  Contact Us
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 