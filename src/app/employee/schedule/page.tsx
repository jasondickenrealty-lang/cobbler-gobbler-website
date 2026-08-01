'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import './schedule.css';

// --- Constants ---
const HOUR_WIDTH = 80;
const DAY_START_HOUR = 6;
const DAY_END_HOUR = 23;
const LOCATION_ID = process.env.NEXT_PUBLIC_LOCATION_ID || 'default';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://us-central1-cobblestone-pos.cloudfunctions.net/api';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'cobblestone';

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
  locationId?: string;
  active?: boolean;
  isActive?: boolean;
  uid?: string;
  email?: string;
}

type ViewMode = 'week' | 'day';
type TimeOffType = 'vacation' | 'sick' | 'personal' | 'other';

interface DayAvailability {
  available: boolean;
  startTime: string;
  endTime: string;
  splitStart?: string;
  splitEnd?: string;
}

interface Availability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

// --- Utility functions ---
/** Monday-based week start */
function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay(); // 0=Sun,1=Mon...6=Sat
  const diff = (day + 6) % 7;  // 0 for Mon, 6 for Sun → always go back to Monday
  result.setDate(result.getDate() - diff);
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

function toISODateFromUnknown(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : toISODate(parsed);
  }
  if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
    const parsed = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(parsed.getTime()) ? null : toISODate(parsed);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : toISODate(value);
  }
  return null;
}

function normalizeLocation(value: unknown): string {
  return String(value || '').trim().toLowerCase();
}

function normalizeSchedule(raw: Partial<Schedule> & Record<string, unknown>): Schedule {
  const status = (raw.status as string | undefined) || ((raw.isOpenShift as boolean | undefined) ? 'open' : 'scheduled');
  const employeeId =
    (raw.employeeId as string | undefined) ||
    (raw.userId as string | undefined) ||
    (raw.uid as string | undefined) ||
    null;

  return {
    id: String(raw.id || ''),
    employeeId,
    shiftDate: toISODateFromUnknown(raw.shiftDate || raw.date || raw.scheduleDate) || '',
    startTime: String(raw.startTime || raw.start || ''),
    endTime: String(raw.endTime || raw.end || ''),
    role: String(raw.role || 'cashier'),
    status,
    isOpenShift: raw.isOpenShift === true || status === 'open',
    notes: (raw.notes as string | undefined) || undefined,
    locationId: String(raw.locationId || raw.location || ''),
  };
}

function formatWeekLabel(start: Date): string {
  const end = addDays(start, 6);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTimeDisplay(startTime)} – ${formatTimeDisplay(endTime)}`;
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

const timeSlots = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => {
  const hour = DAY_START_HOUR + i;
  return { hour, label: formatTimeDisplay(`${hour.toString().padStart(2, '0')}:00`), position: i * HOUR_WIDTH };
});

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

function emptyAvailability(): Availability {
  const day: DayAvailability = { available: false, startTime: '09:00', endTime: '17:00' };
  return {
    monday: { ...day }, tuesday: { ...day }, wednesday: { ...day },
    thursday: { ...day }, friday: { ...day }, saturday: { ...day }, sunday: { ...day },
  };
}

// --- Main Component ---
export default function SchedulePage() {
  const { user } = useAuth();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());

  // Data
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const locationCandidates = useMemo(
    () => Array.from(new Set([LOCATION_ID, 'default', 'main'].map(normalizeLocation).filter(Boolean))),
    []
  );

  // Time Off modal
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [timeOffForm, setTimeOffForm] = useState({
    startDate: toISODate(new Date()),
    endDate: toISODate(new Date()),
    type: 'vacation' as TimeOffType,
    reason: '',
  });
  const [timeOffSubmitting, setTimeOffSubmitting] = useState(false);
  const [timeOffMsg, setTimeOffMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Availability modal
  const [showAvailModal, setShowAvailModal] = useState(false);
  const [availability, setAvailability] = useState<Availability>(emptyAvailability());
  const [availNotes, setAvailNotes] = useState('');
  const [availLoading, setAvailLoading] = useState(false);
  const [availSaving, setAvailSaving] = useState(false);
  const [availMsg, setAvailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  // Fetch employees once
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'tenants', TENANT_ID, 'users'));
        const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Employee));
        const scopedUsers = allUsers.filter((emp) => {
          const isStaff = ['employee', 'cashier', 'kitchen', 'driver', 'manager', 'admin', 'owner'].includes(String(emp.role || '').toLowerCase());
          if (!isStaff) return false;
          if (emp.active === false || emp.isActive === false) return false;
          const loc = normalizeLocation(emp.locationId);
          return !loc || locationCandidates.includes(loc);
        });
        setEmployees(scopedUsers);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, [locationCandidates]);

  // Fetch schedules when week changes
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const startDate = toISODate(weekStart);
        const endDate = toISODate(weekEnd);
        const snapshot = await getDocs(collection(db, 'tenants', TENANT_ID, 'schedules'));
        const normalized = snapshot.docs
          .map(doc => normalizeSchedule({ id: doc.id, ...doc.data() } as Record<string, unknown>))
          .filter(s => !!s.shiftDate)
          .filter(s => s.shiftDate >= startDate && s.shiftDate <= endDate)
          .filter((s) => {
            const loc = normalizeLocation(s.locationId);
            return !loc || locationCandidates.includes(loc);
          })
          .filter(s => s.status !== 'cancelled');
        setSchedules(normalized);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, [weekStart, weekEnd, locationCandidates]);

  const employeeById = useMemo(() => {
    const map = new Map<string, Employee>();
    employees.forEach((emp) => {
      map.set(emp.id, emp);
      if (emp.uid) map.set(emp.uid, emp);
    });
    return map;
  }, [employees]);

  // Filter schedules for current view
  const visibleSchedules = useMemo(() => {
    if (viewMode === 'day') {
      const dayStr = toISODate(selectedDay);
      return schedules.filter(s => s.shiftDate === dayStr);
    }
    return schedules;
  }, [schedules, viewMode, selectedDay]);

  const displayEmployees = useMemo(() => {
    const ordered = [...employees];
    const known = new Set(ordered.map((emp) => emp.id));

    visibleSchedules.forEach((schedule) => {
      if (!schedule.employeeId || schedule.isOpenShift) return;
      const existing = employeeById.get(schedule.employeeId);
      if (existing && !known.has(existing.id)) {
        ordered.push(existing);
        known.add(existing.id);
        return;
      }
      if (!existing && !known.has(schedule.employeeId)) {
        ordered.push({
          id: schedule.employeeId,
          firstName: 'Employee',
          lastName: schedule.employeeId.slice(0, 6),
          role: schedule.role || 'staff',
        });
        known.add(schedule.employeeId);
      }
    });

    return ordered;
  }, [employees, visibleSchedules, employeeById]);

  // Group schedules by employee for visible period
  const schedulesByEmployee = useMemo(() => {
    const grouped = new Map<string, Schedule[]>();
    displayEmployees.forEach(emp => grouped.set(emp.id, []));
    grouped.set('__open__', []);
    visibleSchedules.forEach(schedule => {
      if (schedule.isOpenShift || !schedule.employeeId) {
        grouped.get('__open__')!.push(schedule);
      } else {
        const resolvedEmployeeId = employeeById.get(schedule.employeeId)?.id || schedule.employeeId;
        if (!grouped.has(resolvedEmployeeId)) grouped.set(resolvedEmployeeId, []);
        grouped.get(resolvedEmployeeId)!.push(schedule);
      }
    });
    return grouped;
  }, [visibleSchedules, displayEmployees, employeeById]);

  // Navigation handlers
  const handleWeekChange = useCallback((dir: number) => {
    setWeekStart(prev => addDays(prev, dir * 7));
    if (viewMode === 'day') setSelectedDay(prev => addDays(prev, dir * 7));
  }, [viewMode]);

  const handleDayChange = useCallback((dir: number) => {
    setSelectedDay(prev => {
      const next = addDays(prev, dir);
      setWeekStart(startOfWeek(next));
      return next;
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setWeekStart(startOfWeek(today));
    setSelectedDay(today);
  }, []);

  // API helper
  const apiCall = useCallback(async (method: string, path: string, body?: object) => {
    if (!user) throw new Error('Not authenticated');
    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  }, [user]);

  // --- Time Off ---
  const submitTimeOff = async () => {
    setTimeOffSubmitting(true);
    setTimeOffMsg(null);
    try {
      await apiCall('POST', '/time-off', timeOffForm);
      setTimeOffMsg({ ok: true, text: 'Time off request submitted and auto-approved!' });
      setTimeOffForm({ startDate: toISODate(new Date()), endDate: toISODate(new Date()), type: 'vacation', reason: '' });
    } catch (e: unknown) {
      setTimeOffMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to submit' });
    } finally {
      setTimeOffSubmitting(false);
    }
  };

  // --- Availability ---
  const openAvailModal = useCallback(async () => {
    setShowAvailModal(true);
    setAvailMsg(null);
    setAvailLoading(true);
    try {
      const data = await apiCall('GET', '/availability/my');
      if (data?.availability) {
        setAvailability({ ...emptyAvailability(), ...data.availability });
        setAvailNotes(data.notes || '');
      }
    } catch {
      // First time — use empty defaults
    } finally {
      setAvailLoading(false);
    }
  }, [apiCall]);

  const saveAvailability = async () => {
    setAvailSaving(true);
    setAvailMsg(null);
    try {
      await apiCall('PUT', '/availability', { availability, notes: availNotes, locationId: LOCATION_ID });
      setAvailMsg({ ok: true, text: 'Availability saved!' });
    } catch (e: unknown) {
      setAvailMsg({ ok: false, text: e instanceof Error ? e.message : 'Failed to save' });
    } finally {
      setAvailSaving(false);
    }
  };

  const toggleDayAvail = (day: keyof Availability) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available },
    }));
  };

  const addSplit = (day: keyof Availability) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], splitStart: '13:00', splitEnd: '17:00' },
    }));
  };

  const removeSplit = (day: keyof Availability) => {
    setAvailability(prev => {
      const updated = { ...prev[day] };
      delete updated.splitStart;
      delete updated.splitEnd;
      return { ...prev, [day]: updated };
    });
  };

  // Inject shift positions only — time slot and gridline positions live in static CSS
  const dynamicCSS = useMemo(() => {
    const rules: string[] = [];
    schedulesByEmployee.forEach((shifts, empId) => {
      shifts.forEach(shift => {
        const pos = calculateShiftPosition(shift.startTime, shift.endTime);
        const color = empId !== '__open__' ? ` background-color: ${getRoleColor(shift.role)};` : '';
        rules.push(`[data-shift-id="${shift.id}"] { left: ${pos.left}px; width: ${pos.width - 4}px;${color} }`);
      });
    });
    return rules.join('\n');
  }, [schedulesByEmployee]);

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-schedule-styles', '');
    styleEl.textContent = dynamicCSS;
    document.head.appendChild(styleEl);
    return () => { document.head.removeChild(styleEl); };
  }, [dynamicCSS]);

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header row */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Team Schedule</h1>
              {/* Action buttons — top-right on mobile */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowTimeOffModal(true); setTimeOffMsg(null); }}
                  className="px-3 py-2 rounded-lg bg-amber-500 text-white text-xs sm:text-sm font-semibold hover:bg-amber-600 transition-colors whitespace-nowrap"
                >Time Off</button>
                <button
                  type="button"
                  onClick={openAvailModal}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition-colors whitespace-nowrap"
                >Availability</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
              {/* Week / Day toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 transition-colors ${viewMode === 'week' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('day')}
                  className={`px-4 py-2 transition-colors border-l border-gray-300 ${viewMode === 'day' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Daily
                </button>
              </div>

              {/* Date navigation */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => viewMode === 'day' ? handleDayChange(-1) : handleWeekChange(-1)}
                  className="w-11 h-11 shrink-0 rounded-lg border border-gray-300 bg-white text-gray-700 text-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >&#8249;</button>

                <div className="font-semibold text-gray-700 bg-gray-100 px-3 py-2 rounded-full text-sm flex-1 text-center min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {viewMode === 'week' ? formatWeekLabel(weekStart) : formatDayLabel(selectedDay)}
                </div>

                <button
                  type="button"
                  onClick={() => viewMode === 'day' ? handleDayChange(1) : handleWeekChange(1)}
                  className="w-11 h-11 shrink-0 rounded-lg border border-gray-300 bg-white text-gray-700 text-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >&#8250;</button>

                <button
                  type="button"
                  onClick={goToToday}
                  className="shrink-0 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >Today</button>
              </div>
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

          {/* Gantt */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Loading schedule...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="flex schedule-grid">
                {/* Fixed labels */}
                <div className="flex-shrink-0 bg-gray-50 border-r border-gray-200 schedule-labels-column">
                  <div className="flex items-center px-3 font-semibold text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 schedule-header-cell">
                    Employee
                  </div>
                  {displayEmployees.map(emp => (
                    <div
                      key={emp.id}
                      className={`flex items-center px-3 border-b border-gray-100 ${user?.uid === emp.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''} schedule-row`}
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
                  <div className="flex items-center px-3 border-b border-gray-100 bg-green-50/50 schedule-row">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-green-600">Open Shifts</span>
                      <span className="text-xs text-green-400">Available</span>
                    </div>
                  </div>
                </div>

                {/* Scrollable timeline */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                  <div className="relative bg-gray-50 border-b border-gray-200 schedule-time-header">
                    {timeSlots.map(slot => (
                      <div key={slot.hour} className="absolute top-0 h-full flex items-center justify-center border-r border-gray-100 schedule-time-slot">
                        <span className="text-xs font-semibold text-gray-400">{slot.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    {displayEmployees.map(emp => {
                      const shifts = schedulesByEmployee.get(emp.id) || [];
                      const isMe = user?.uid === emp.id;
                      return (
                        <div key={emp.id} className={`relative border-b border-gray-100 schedule-employee-row ${isMe ? 'bg-primary/5' : ''}`}>
                          {shifts.map(shift => (
                            <div
                              key={shift.id}
                              data-shift-id={shift.id}
                              className="absolute rounded-lg overflow-hidden shadow-sm schedule-shift-block"
                              title={`${shift.shiftDate} · ${formatTimeRange(shift.startTime, shift.endTime)} · ${shift.role}`}
                            >
                              <div className="h-full px-2 flex flex-col justify-center text-white">
                                <div className="text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                                  {viewMode === 'week'
                                    ? `${new Date(shift.shiftDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })} · ${formatTimeRange(shift.startTime, shift.endTime)}`
                                    : formatTimeRange(shift.startTime, shift.endTime)}
                                </div>
                                <div className="text-[10px] opacity-80 capitalize">{shift.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    {/* Open Shifts Row */}
                    <div className="relative border-b border-gray-100 bg-green-50/30 schedule-open-row">
                      {(schedulesByEmployee.get('__open__') || []).map(shift => (
                        <div
                          key={shift.id}
                          data-shift-id={shift.id}
                          className="absolute rounded-lg overflow-hidden schedule-open-shift"
                          title={`${shift.shiftDate} · ${formatTimeRange(shift.startTime, shift.endTime)} · ${shift.role} (Open)`}
                        >
                          <div className="h-full px-2 flex flex-col justify-center">
                            <div className="text-[11px] font-bold whitespace-nowrap overflow-hidden text-ellipsis text-green-700">
                              {viewMode === 'week'
                                ? `${new Date(shift.shiftDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })} · ${formatTimeRange(shift.startTime, shift.endTime)}`
                                : formatTimeRange(shift.startTime, shift.endTime)}
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

      {/* ---- Time Off Modal ---- */}
      {showTimeOffModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 px-4 py-8 sm:items-center">
          <div className="my-auto bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Request Time Off</h2>
              <button type="button" onClick={() => setShowTimeOffModal(false)} className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    id="timeoff-start-date"
                    aria-label="Time off start date"
                    type="date"
                    value={timeOffForm.startDate}
                    onChange={e => setTimeOffForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full min-w-0 appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    id="timeoff-end-date"
                    aria-label="Time off end date"
                    type="date"
                    value={timeOffForm.endDate}
                    min={timeOffForm.startDate}
                    onChange={e => setTimeOffForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full min-w-0 appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  id="timeoff-type"
                  aria-label="Time off request type"
                  value={timeOffForm.type}
                  onChange={e => setTimeOffForm(f => ({ ...f, type: e.target.value as TimeOffType }))}
                  className="w-full min-w-0 appearance-none border border-gray-300 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-gray-400">(optional)</span></label>
                <textarea
                  value={timeOffForm.reason}
                  onChange={e => setTimeOffForm(f => ({ ...f, reason: e.target.value }))}
                  rows={3}
                  placeholder="Any additional details..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {timeOffMsg && (
                <p className={`text-sm font-medium ${timeOffMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {timeOffMsg.text}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTimeOffModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >Cancel</button>
                <button
                  type="button"
                  onClick={submitTimeOff}
                  disabled={timeOffSubmitting}
                  className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {timeOffSubmitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Availability Modal ---- */}
      {showAvailModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 px-4 py-8 sm:items-center">
          <div className="my-auto bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Weekly Availability</h2>
              <button type="button" onClick={() => setShowAvailModal(false)} className="-m-2 flex h-11 w-11 shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {availLoading ? (
              <p className="text-center text-gray-500 py-8">Loading your availability…</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Set which days and hours you&apos;re available. This helps the scheduler build your shifts.</p>

                {DAYS_OF_WEEK.map(day => {
                  const d = availability[day];
                  return (
                    <div key={day} className={`rounded-xl border p-3 transition-colors ${d.available ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex min-h-[44px] items-center gap-3 cursor-pointer select-none">
                          <div
                            onClick={() => toggleDayAvail(day)}
                            className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center px-1 ${d.available ? 'bg-emerald-500' : 'bg-gray-300'}`}
                          >
                            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${d.available ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                          <span className="font-semibold text-sm text-gray-800 capitalize w-20">{DAY_LABELS[day]}day</span>
                        </label>

                        {d.available && (
                          <div className="flex w-full flex-wrap items-center gap-2 text-sm sm:w-auto sm:flex-nowrap">
                            <input
                              aria-label={`${DAY_LABELS[day]} start time`}
                              type="time"
                              value={d.startTime}
                              onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], startTime: e.target.value } }))}
                              className="min-h-[44px] min-w-0 appearance-none border border-gray-300 rounded-lg px-2 py-2 text-base sm:min-h-0 sm:py-1 sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                            <span className="text-gray-400 text-xs">to</span>
                            <input
                              aria-label={`${DAY_LABELS[day]} end time`}
                              type="time"
                              value={d.endTime}
                              onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], endTime: e.target.value } }))}
                              className="min-h-[44px] min-w-0 appearance-none border border-gray-300 rounded-lg px-2 py-2 text-base sm:min-h-0 sm:py-1 sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                          </div>
                        )}
                        {!d.available && <span className="text-xs text-gray-400">Not available</span>}
                      </div>

                      {d.available && (
                        <div className="mt-2 sm:pl-[52px]">
                          {d.splitStart !== undefined ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs text-gray-400 w-8 shrink-0">Also</span>
                              <input
                                aria-label={`${DAY_LABELS[day]} split shift start time`}
                                type="time"
                                value={d.splitStart}
                                onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], splitStart: e.target.value } }))}
                                className="min-h-[44px] min-w-0 appearance-none border border-gray-300 rounded-lg px-2 py-2 text-base sm:min-h-0 sm:py-1 sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              />
                              <span className="text-gray-400 text-xs">to</span>
                              <input
                                aria-label={`${DAY_LABELS[day]} split shift end time`}
                                type="time"
                                value={d.splitEnd ?? '17:00'}
                                onChange={e => setAvailability(prev => ({ ...prev, [day]: { ...prev[day], splitEnd: e.target.value } }))}
                                className="min-h-[44px] min-w-0 appearance-none border border-gray-300 rounded-lg px-2 py-2 text-base sm:min-h-0 sm:py-1 sm:text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              />
                              <button
                                type="button"
                                onClick={() => removeSplit(day)}
                                className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-300 hover:text-red-400 text-base leading-none transition-colors"
                                aria-label="Remove split shift"
                              >✕</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addSplit(day)}
                              className="inline-flex min-h-[44px] items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                            >
                              <span className="text-base leading-none">+</span> Add split shift
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    value={availNotes}
                    onChange={e => setAvailNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Can't work before 10am on Tuesdays"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  />
                </div>

                {availMsg && (
                  <p className={`text-sm font-medium ${availMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                    {availMsg.text}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAvailModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >Close</button>
                  <button
                    type="button"
                    onClick={saveAvailability}
                    disabled={availSaving}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {availSaving ? 'Saving…' : 'Save Availability'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
