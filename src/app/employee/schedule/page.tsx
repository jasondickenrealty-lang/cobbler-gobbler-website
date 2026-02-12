'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';

interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'schedules'),
          where('employeeId', '==', user.uid),
          orderBy('date', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const scheduleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[];
        
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-primary">My Schedule</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-600">No scheduled shifts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-semibold">{schedule.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Start Time</p>
                      <p className="font-semibold">{schedule.startTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">End Time</p>
                      <p className="font-semibold">{schedule.endTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Position</p>
                      <p className="font-semibold capitalize">{schedule.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
