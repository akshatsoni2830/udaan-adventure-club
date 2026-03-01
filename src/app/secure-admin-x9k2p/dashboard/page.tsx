'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Package {
  id: number;
  title: string;
  duration: string;
  createdAt: string;
}

interface Destination {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'packages' | 'destinations'>('packages');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, destinationsRes, enquiriesRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/destinations'),
        fetch('/api/admin/enquiries')
      ]);

      if (packagesRes.ok) {
        const data = await packagesRes.json();
        setPackages(data.packages || []);
      }

      if (destinationsRes.ok) {
        const data = await destinationsRes.json();
        setDestinations(data.destinations || []);
      }

      if (enquiriesRes.ok) {
        const data = await enquiriesRes.json();
        setEnquiries(data.enquiries || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/secure-admin-x9k2p/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeletePackage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Package deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package');
    }
  };

  const handleDeleteDestination = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      const response = await fetch(`/api/admin/destinations/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Destination deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error deleting destination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Packages</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{packages.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Destinations</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{destinations.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'packages'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Packages ({packages.length})
              </button>
              <button
                onClick={() => setActiveTab('destinations')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'destinations'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Destinations ({destinations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Packages</h2>
                  <Link
                    href="/secure-admin-x9k2p/packages/new"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    + Add New Package
                  </Link>
                </div>
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{pkg.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Duration: {pkg.duration}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Created: {new Date(pkg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/package/${pkg.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            View
                          </Link>
                          <Link
                            href={`/secure-admin-x9k2p/packages/${pkg.id}/edit`}
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {activeTab === 'destinations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Manage Destinations</h2>
                  <Link
                    href="/secure-admin-x9k2p/destinations/new"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    + Add New Destination
                  </Link>
                </div>
                <div className="space-y-4">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{dest.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{dest.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Created: {new Date(dest.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/destination/${dest.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            View
                          </Link>
                          <Link
                            href={`/secure-admin-x9k2p/destinations/${dest.id}/edit`}
                            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteDestination(dest.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
