'use client';

import { useState } from 'react';
// Removed unused imports

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '', // included to match API input
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!whatsappNumber) {
      alert('WhatsApp number is not configured. Please set NEXT_PUBLIC_WHATSAPP_NUMBER.');
      return;
    }

    // WhatsApp requires an international number with digits only (no +, spaces, or symbols)
    const sanitizedNumber = String(+919328891173).replace(/\D+/g, '');
    const text = `🌐 Website Enquiry\n👤 Name: ${formData.name}\n📧 Email: ${formData.email}\n📞 Phone: ${formData.phone || 'N/A'}\n💬 Message: ${formData.message}`;
    const url = `https://api.whatsapp.com/send?phone=${sanitizedNumber}&text=${encodeURIComponent(text)}`;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank'); // open in new tab
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Tell Us About Your Dream Journey</h2>
            <p className="text-gray-600 text-lg">And We will help You Turn It Into Reality</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                required
                placeholder="Full Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                required
                placeholder="Your Email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                placeholder="Phone Number"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Your Adventure Story</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900"
                required
                placeholder="Share your dream destination, travel dates, and any specific experiences you're looking for..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
            >
              Begin Your Journey
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
