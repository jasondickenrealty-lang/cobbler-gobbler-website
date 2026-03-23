'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import './schedule.css';

// --- Types ---
interface Schedule {
  id: string;
  employeeId: string | null;
  shiftDate: string;
  startTime: string;
  endTime: string;
  role: string;
  status: string;
  isOpenShift: boolean;
  notes?: string;
  locationId?: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

// --- Constants ---
const HOUR_WIDTH = 80;
const ROW_HEIGHT = 56;
const DAY_START_HOUR = 6;
const DAY_END_HOUR = 23;
const LOCATION_ID = 'main';

// --- Utility functions ---
function startOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatWeekLabel(start: Date): string {
  const end = addDays(start, 6);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTimeDisplay(startTime)} - ${formatTimeDisplay(endTime)}`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function calculateShiftPosition(startTime: string, endTime: string) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const gridStartMinutes = DAY_START_HOUR * 60;
  const left = ((startMinutes - gridStartMinutes) / 60) * HOUR_WIDTH;
  const width = ((endMinutes - startMinutes) / 60) * HOUR_WIDTH;
  return { left: Math.max(0, left), width: Math.max(HOUR_WIDTH / 4, width) };
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    cashier: '#3b82f6',
    kitchen: '#22c55e',
    manager: '#8b5cf6',
    driver: '#f97316',
    admin: '#64748b',
  };
  return colors[role] || '#64748b';
}

const gridWidth = (DAY_END_HOUR - DAY_START_HOUR + 1) * HOUR_WIDTH;
const timeSlots = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => {
  const hour = DAY_START_HOUR + i;
  return { hour, label: formatTimeDisplay(`${hour.toString().padStart(2, '0')}:00`), position: i * HOUR_WIDTH };
});

export default function SchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  // Fetch employees once
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const q = query(collection(db, 'employees'), where('locationId', '==', LOCATION_ID));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch schedules when week changes
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const startDate = toISODate(weekStart);
        const endDate = toISODate(weekEnd);
        const q = query(
          collection(db, 'schedules'),
          where('locationId', '==', LOCATION_ID),
          where('shiftDate', '>=', startDate),
          where('shiftDate', '<=', endDate)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Schedule));
        setSchedules(data.filter(s => s.status !== 'cancelled'));
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [weekStart, weekEnd]);

  // Group schedules by employee
  const schedulesByEmployee = useMemo(() => {
    const grouped = new Map<string, Schedule[]>();
    employees.forEach(emp => grouped.set(emp.id, []));
    grouped.set('__open__', []);

    schedules.forEach(schedule => {
      if (schedule.isOpenShift || !schedule.employeeId) {
        const arr = grouped.get('__open__') || [];
        arr.push(schedule);
        grouped.set('__open__', arr);
      } else {
        const arr = grouped.get(schedule.employeeId) || [];
        arr.push(schedule);
        grouped.set(schedule.employeeId, arr);
      }
    });
    return grouped;
  }, [schedules, employees]);

  // Generate dynamic CSS for shift/gridline positioning to avoid inline styles
  const dynamicCSS = useMemo(() => {
    const rules: string[] = [];

    // Time slot positions (nth-child is 1-based)
    timeSlots.forEach((slot, i) => {
      rules.push(`.schedule-time-slot:nth-child(${i + 1}) { left: ${slot.position}px; }`);
    });

    // Grid line positions
    timeSlots.forEach((_, i) => {
      rules.push(`.schedule-gridline:nth-child(${i + 1}) { left: ${i * HOUR_WIDTH}px; }`);
    });

    // Shift blocks by data-shift-id
    const allEmployeeIds = [...employees.map(e => e.id), '__open__'];
    allEmployeeIds.forEach(empId => {
      const shifts = schedulesByEmployee.get(empId) || [];
      shifts.forEach(shift => {
        const pos = calculateShiftPosition(shift.startTime, shift.endTime);
        if (empId === '__open__') {
          rules.push(`[data-shift-id="${shift.id}"] { left: ${pos.left}px; width: ${pos.width - 4}px; }`);
        } else {
          const roleColor = getRoleColor(shift.role);
          rules.push(`[data-shift-id="${shift.id}"] { left: ${pos.left}px; width: ${pos.width - 4}px; background-color: ${roleColor}; }`);
        }
      });
    });

    return rules.join('\n');
  }, [employees, schedulesByEmployee]);

  // Inject dynamic CSS via textContent instead of dangerouslySetInnerHTML to prevent XSS
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-schedule-styles', '');
    styleEl.textContent = dynamicCSS;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, [dynamicCSS]);

  const handleWeekChange = (direction: number) => {
    setWeekStart(prev => addDays(prev, direction * 7));
  };

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-primary">Team Schedule</h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleWeekChange(-1)}
                className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                &#8249;
              </button>
              <div className="font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-full text-sm min-w-[200px] text-center">
                {formatWeekLabel(weekStart)}
              </div>
              <button
                type="button"
                onClick={() => handleWeekChange(1)}
                className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 text-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                &#8250;
              </button>
              <button
                type="button"
                onClick={() => setWeekStart(startOfWeek(new Date()))}
                className="ml-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Today
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              { role: 'cashier', label: 'Cashier', color: 'bg-blue-500' },
              { role: 'kitchen', label: 'Kitchen', color: 'bg-green-500' },
              { role: 'manager', label: 'Manager', color: 'bg-purple-500' },
              { role: 'driver', label: 'Driver', color: 'bg-orange-500' },
            ].map(item => (
              <div key={item.role} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                {item.label}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Loading schedule...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="flex schedule-grid">
                {/* Fixed employee labels column */}
                <div className="flex-shrink-0 bg-gray-50 border-r border-gray-200 schedule-labels-column">
                  {/* Header spacer */}
                  <div
                    className="flex items-center px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 schedule-header-cell"
                  >
                    Employee
                  </div>
                  {/* Employee labels */}
                  {employees.map(emp => (
                    <div
                      key={emp.id}
                      className={`flex items-center px-3 border-b border-gray-100 ${
                        user?.uid === emp.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      } schedule-row`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`font-semibold text-sm truncate ${user?.uid === emp.id ? 'text-primary' : 'text-gray-800'}`}>
                          {emp.firstName} {emp.lastName}
                          {user?.uid === emp.id && <span className="text-xs font-normal text-primary ml-1">(You)</span>}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">{emp.role}</span>
                      </div>
                    </div>
                  ))}
                  {/* Open shifts label */}
                  <div
                    className="flex items-center px-3 border-b border-gray-100 bg-green-50/50 schedule-row"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-green-600">Open Shifts</span>
                      <span className="text-xs text-green-400">Available</span>
                    </div>
                  </div>
                </div>

                {/* Scrollable timeline area */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                  {/* Time header */}
                  <div className="relative bg-gray-50 border-b border-gray-200 schedule-time-header">
                    {timeSlots.map(slot => (
                      <div
                        key={slot.hour}
                        className="absolute top-0 h-full flex items-center justify-center border-r border-gray-100 schedule-time-slot"
                      >
                        <span className="text-xs font-semibold text-gray-400">{slot.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Employee rows */}
                  <div className="relative">
                    {employees.map(emp => {
                      const shifts = schedulesByEmployee.get(emp.id) || [];
                      const isCurrentUser = user?.uid === emp.id;
                      return (
                        <div
                          key={emp.id}
                          className={`relative border-b border-gray-100 schedule-employee-row ${isCurrentUser ? 'bg-primary/5' : ''}`}
                        >
                          {/* Grid lines */}
                          {timeSlots.map((_, i) => (
                            <div
                              key={i}
                              className="absolute top-0 bottom-0 border-r border-gray-50 schedule-gridline"
                            />
                          ))}
                          {/* Shift blocks */}
                          {shifts.map(shift => (
                              <div
                                key={shift.id}
                                data-shift-id={shift.id}
                                className="absolute rounded-lg overflow-hidden shadow-sm schedule-shift-block"
                                title={`${formatTimeRange(shift.startTime, shift.endTime)} - ${shift.role}`}
                              >
                                <div className="h-full px-2 flex flex-col justify-center text-white">
                                  <div className="text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                    {formatTimeRange(shift.startTime, shift.endTime)}
                                  </div>
                                  <div className="text-[10px] opacity-80 capitalize">{shift.role}</div>
                                </div>
                              </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Open Shifts Row */}
                    <div
                      className="relative border-b border-gray-100 bg-green-50/30 schedule-open-row"
                    >
                      {timeSlots.map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-r border-gray-50 schedule-gridline"
                        />
                      ))}
                      {(schedulesByEmployee.get('__open__') || []).map(shift => (
                          <div
                            key={shift.id}
                            data-shift-id={shift.id}
                            className="absolute rounded-lg overflow-hidden schedule-open-shift"
                            title={`${formatTimeRange(shift.startTime, shift.endTime)} - ${shift.role} (Open)`}
                          >
                            <div className="h-full px-2 flex flex-col justify-center">
                              <div className="text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis text-green-700">
                                {formatTimeRange(shift.startTime, shift.endTime)}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-green-600 capitalize">{shift.role}</span>
                                <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded font-bold">OPEN</span>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
