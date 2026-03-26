/**
 * This file defines the structure of clock events and provides a sample dataset for simulation.
 */
export type ClockEventType = 'clock-in' | 'break-start' | 'break-end' | 'clock-out';

export interface ClockEvent {
  id: string;
  staffId: string;
  type: ClockEventType;
  rawTime: string;    // HH:MM in 24hr format, unprocessed clock event time
  date: string;       // YYYY-MM-DD
}

const TODAY = new Date().toISOString().split('T')[0]; // always YYYY-MM-DD of today
export const todaysClockEvents: ClockEvent[] = [

  // MIA (s1) — clocks in 4 mins early, on time effectively
  { id: 'ce1', staffId: 's1', type: 'clock-in', rawTime: '05:50', date: TODAY },
  { id: 'ce2', staffId: 's1', type: 'break-start', rawTime: '10:02', date: TODAY },
  { id: 'ce3', staffId: 's1', type: 'break-end', rawTime: '10:31', date: TODAY },
  { id: 'ce4', staffId: 's1', type: 'clock-out', rawTime: '14:03', date: TODAY },

  // JAKE (s2) — clocks in 8 mins late → rounds to next :15
  { id: 'ce5', staffId: 's2', type: 'clock-in', rawTime: '06:08', date: 'TODAY' },
  { id: 'ce6', staffId: 's2', type: 'break-start', rawTime: '09:28', date: 'TODAY' },
  { id: 'ce7', staffId: 's2', type: 'break-end', rawTime: '10:01', date: 'TODAY' },
  { id: 'ce8', staffId: 's2', type: 'clock-out', rawTime: '11:58', date: 'TODAY' },

  // SALLY (s3) — clocks in 3 mins late → grace, rounds back to 07:00
  // Clocks out 18 mins late → overtime flag fires
  { id: 'ce9', staffId: 's3', type: 'clock-in', rawTime: '07:03', date: 'TODAY' },
  { id: 'ce10', staffId: 's3', type: 'break-start', rawTime: '10:00', date: 'TODAY' },
  { id: 'ce11', staffId: 's3', type: 'break-end', rawTime: '10:35', date: 'TODAY' },
  { id: 'ce12', staffId: 's3', type: 'clock-out', rawTime: '13:18', date: 'TODAY' },

  // JASON (s4) — no-show, no clock events at all

  // SARAH (s5) — clocks in 4 mins late → grace, rounds back to 09:00
  // Exactly 3hr shift — minimum engagement boundary
  { id: 'ce13', staffId: 's5', type: 'clock-in', rawTime: '09:04', date: 'TODAY' },
  { id: 'ce14', staffId: 's5', type: 'clock-out', rawTime: '13:57', date: 'TODAY' },

  // JUSTIN (s6) — clocks in on time, no break taken despite 6hr shift
  // Compliance flag fires for missing meal break
  { id: 'ce15', staffId: 's6', type: 'clock-in', rawTime: '11:00', date: 'TODAY' },
  { id: 'ce16', staffId: 's6', type: 'clock-out', rawTime: '17:08', date: 'TODAY' },

];

/** 
Each staff member maps to a different anomaly:

Mia → clean, no issues
Jake → late clock-in rounded to :15
Sarah → grace on clock-in, overtime flag on clock-out
Tom → no-show
Priya → grace on clock-in
Justin → missing break compliance flag
*/