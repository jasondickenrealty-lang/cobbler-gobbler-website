'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

type ContestSignup = {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventDate?: string;
  createdAt?: { toDate?: () => Date; seconds?: number } | null;
};

const ALLOWED_ROLES = new Set(['admin', 'manager', 'owner']);

function formatCreatedAt(value: ContestSignup['createdAt']) {
  if (!value) return 'Unknown';
  if (typeof value.toDate === 'function') {
    return value.toDate().toLocaleString();
  }
  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toLocaleString();
  }
  return 'Unknown';
}

export default function ContestSignupsPage() {
  const { userData } = useAuth();
  const [signups, setSignups] = useState<ContestSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const canView = useMemo(() => ALLOWED_ROLES.has(userData?.role ?? ''), [userData?.role]);

  useEffect(() => {
    const fetchSignups = async () => {
      if (!canView) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const signupsQuery = query(
          collection(db, 'contestSignups'),
          orderBy('createdAt', 'desc'),
          limit(250)
        );
        const snapshot = await getDocs(signupsQuery);
        const rows = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ContestSignup, 'id'>),
        }));
        setSignups(rows);
      } catch (err) {
        console.error('Failed to fetch contest signups', err);
        setError('Could not load contest signups right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchSignups();
  }, [canView]);

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-bold text-primary">Contest Signups</h1>
          <p className="mb-8 text-gray-600">Annual Cobble Eating Contest - May 24, 2026</p>

          {!canView ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
              You do not have permission to view contest signups.
            </div>
          ) : loading ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">Loading signups...</div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
          ) : signups.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-600">No signups yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Event Date</th>
                    <th className="px-4 py-3">Signed Up At</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((signup) => (
                    <tr key={signup.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{signup.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{signup.phone || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{signup.email || '-'}</td>
                      <td className="px-4 py-3 text-gray-700">{signup.eventDate || '2026-05-24'}</td>
                      <td className="px-4 py-3 text-gray-700">{formatCreatedAt(signup.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}