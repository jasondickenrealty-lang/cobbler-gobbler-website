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
  shiftDate: string;
  startTime: string;
  endTime: string;
  role: string;
  status: string;
  notes?: string;
  locationId?: string;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user) return;

      try {
        // Get all schedules for this employee
        const q = query(
          collection(db, 'schedules'),
          where('employeeId', '==', user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        let scheduleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Schedule[];
        
        // Sort by date (newest first) and filter to show recent and upcoming
        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        scheduleData = scheduleData
          .filter(s => {
            const shiftDate = new Date(s.shiftDate);
            return shiftDate >= thirtyDaysAgo;
          })
          .sort((a, b) => b.shiftDate.localeCompare(a.shiftDate));
        
        setSchedules(scheduleData);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'swap_pending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-sm text-gray-500 mt-2">Your manager will assign shifts in the POS system.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatDate(schedule.shiftDate)}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                      {schedule.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Position</p>
                      <p className="font-semibold text-gray-900 capitalize">{schedule.role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {(() => {
                          const start = new Date(`2000-01-01T${schedule.startTime}`);
                          const end = new Date(`2000-01-01T${schedule.endTime}`);
                          const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          return `${diff.toFixed(1)} hours`;
                        })()}
                      </p>
                    </div>
                  </div>
                  {schedule.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-700">{schedule.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
