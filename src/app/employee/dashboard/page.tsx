'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, userData } = useAuth();

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-primary">Dashboard</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Welcome Card */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-accent">Welcome Back!</h2>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-semibold">Email:</span> {user?.email}</p>
                <p><span className="font-semibold">Role:</span> <span className="capitalize">{userData?.role}</span></p>
                <p><span className="font-semibold">Status:</span> {userData?.active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-accent">Quick Links</h2>
              <div className="space-y-3">
                <a href="/employee/schedule" className="block p-3 bg-primary text-white rounded hover:bg-opacity-90 transition text-center">
                  View Schedule
                </a>
                <a href="/employee/announcements" className="block p-3 bg-accent text-white rounded hover:bg-opacity-90 transition text-center">
                  Announcements
                </a>
              </div>
            </div>

            {/* Announcements Preview */}
            <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4 text-accent">Recent Announcements</h2>
              <div className="text-gray-600">
                <p>Check the Announcements page for the latest updates.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
