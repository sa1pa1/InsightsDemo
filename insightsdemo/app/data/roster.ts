/**
 * This file contains the scheduled shifts for the current day. 
 * Each shift includes the staff member's ID, role, scheduled start and end times, 
 * and break details. 
 * 
 * This data is used to analyse compliance with award rules and identify any potential issues with the roster.
 */
import { StaffRole } from "./staff";

export interface ScheduledShift {
  id: string;
  staffId: string;
  role: StaffRole;
  date: string;           // YYYY-MM-DD
  scheduledStart: string; // HH:MM
  scheduledEnd: string;   // HH:MM
  breakStart?: string;    // HH:MM
  breakEnd?: string;      // HH:MM
  unpaidBreakMinutes: number;
}

const TODAY = new Date().toISOString().split('T')[0]; // always YYYY-MM-DD of today

export const todaysRoster: ScheduledShift[] = [
  {
    id: 'r1',
    staffId: 's1',
    role: 'head-barista',
    date: TODAY,
    scheduledStart: '06:00',
    scheduledEnd: '14:00',
    breakStart: '10:00',
    breakEnd: '10:30',
    unpaidBreakMinutes: 30,
  },
  {
    id: 'r2',
    staffId: 's2',
    role: 'barista',
    date: TODAY,
    scheduledStart: '06:00',
    scheduledEnd: '12:00',
    breakStart: '09:30',
    breakEnd: '10:00',
    unpaidBreakMinutes: 30,
  },
  {
    id: 'r3',
    staffId: 's3',
    role: 'floor',
    date: TODAY,
    scheduledStart: '07:00',
    scheduledEnd: '13:00',
    breakStart: '10:00',
    breakEnd: '10:30',
    unpaidBreakMinutes: 30,
  },
  {
    id: 'r4',
    staffId: 's4',
    role: 'kitchen',
    date: TODAY,
    scheduledStart: '08:00',
    scheduledEnd: '14:00',
    breakStart: '11:00',
    breakEnd: '11:30',
    unpaidBreakMinutes: 30,
  },
  {
    id: 'r5',
    staffId: 's5',
    role: 'floor',
    date: TODAY,
    scheduledStart: '09:00',
    scheduledEnd: '14:00',
    unpaidBreakMinutes: 0,
  },
  {
    id: 'r6',
    staffId: 's6',
    role: 'barista',
    date: TODAY,
    scheduledStart: '11:00',
    scheduledEnd: '17:00',
    breakStart: '13:30',
    breakEnd: '14:00',
    unpaidBreakMinutes: 30,
  },
];

/*
Edge cases: 
- Jason and Kathy have shorter shifts
  -> Kathy (s2) < 5 hours, no meal break
  -> Jason (s4) > 5 hours, 1 meal break
- Sarah has no break, but her shift is only 5 hours, so this is compliant with the award rules.
- Mia (s1) as full-time head barista has the longest shift. 
- All shifts is longer than 3 hours, so all staff have at least a 30 minute break (either paid or unpaid) - compliant with award rules.

*/