/**
 * This utility takes roster, clock events and rounding engine
 * as inputs and computes final billable hours for each staff member, 
 * applying rounding rules and flags as needed.
 * */

import { staff } from "../data/staff";
import { todaysRoster } from "../data/roster";
import { todaysClockEvents } from "../data/clockEvents";
import { venueConfig } from "../data/config";
import { roundClockIn, roundClockOut, checkMissingBreak, RoundingResult } from "./rounding";

//___________________________________________________________________________________________
//------------------------------Types--------------------------------------------------------
//___________________________________________________________________________________________

export interface ProcessedShift {
  staffId: string;
  firstName: string;
  lastName: string;
  role: string;
  scheduledStart: string;
  scheduledEnd: string;
  clockInResult: RoundingResult | null;
  clockOutResult: RoundingResult | null;
  breakMissingResult: RoundingResult | null;
  billableStart: string | null;
  billableEnd: string | null;
  billableHours: number;
  grossPay: number;
  status: 'on-floor' | 'on-break' | 'finished' | 'no-show' | 'scheduled';
}

export interface HourlySummary {
  hour: number;         // 0–23
  label: string;        // e.g. '6am', '12pm'
  sales: number;
  labourCost: number;
  labourPct: number;
  splh: number;
  staffCount: number;
}

//___________________________________________________________________________________________
//------------------------Helper Functions---------------------------------------------------
//___________________________________________________________________________________________

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toHours(minutes: number): number {
  return minutes / 60;
}

// function formatHourLabel(hour: number): string {
//     if (hour === 0) return '12am';
//     if (hour < 12) return `${hour}am`;
//     if (hour === 12) return '12pm';
//     return `${hour - 12}pm`;
//   }

// Get penalty multiplier for a given time and day
function getPenaltyMultiplier(time: string, date: string): number {
  const day = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday
  const minutes = toMinutes(time);
  const { penaltyRates } = venueConfig;

  if (day === 0) return penaltyRates.sunday.multiplier;
  if (day === 6) return penaltyRates.saturday.multiplier;

  const earlyBefore = toMinutes(penaltyRates.earlyMorning.before);
  const eveningAfter = toMinutes(penaltyRates.evening.after);

  if (minutes < earlyBefore) return penaltyRates.earlyMorning.multiplier;
  if (minutes >= eveningAfter) return penaltyRates.evening.multiplier;

  return 1.0;
}

//____________________________________________________________________________________________
// ------------------------Main Calculation Function------------------------------------------
// This function processes the raw roster and clock event data to produce a detailed breakdown 
// ------------------------of each shift------------------------------------------------------
//____________________________________________________________________________________________

export function processShifts(): ProcessedShift[] {
  return todaysRoster.map(shift => {
    const staffMember = staff.find(s => s.id === shift.staffId);
    if (!staffMember) return null;

    const now = new Date();
    const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const events = todaysClockEvents.filter(e => e.staffId === shift.staffId);
    const clockInEvent = events.find(e => e.type === 'clock-in');
    const clockOutEvent = events.find(e => e.type === 'clock-out');
    const breakStartEvent = events.find(e => e.type === 'break-start');
    const breakEndEvent = events.find(e => e.type === 'break-end');
    const hasBreak = !!(breakStartEvent && breakEndEvent);

    // No clock-in at all → no-show
    if (!clockInEvent) {
      return {
        staffId: shift.staffId,
        firstName: staffMember.firstName,
        lastName: staffMember.lastName,
        role: shift.role,
        scheduledStart: shift.scheduledStart,
        scheduledEnd: shift.scheduledEnd,
        clockInResult: null,
        clockOutResult: null,
        breakMissingResult: null,
        billableStart: null,
        billableEnd: null,
        billableHours: 0,
        grossPay: 0,
        status: 'no-show',
      };
    }

    // Process clock-in
    const clockInResult = roundClockIn(clockInEvent.rawTime, shift.scheduledStart);

    // Process clock-out if exists
    const clockOutResult = clockOutEvent && clockOutEvent.rawTime <= nowTime
      ? roundClockOut(clockOutEvent.rawTime, shift.scheduledEnd)
      : null;

    // Check for missing break
    const breakMissingResult = clockOutResult
      ? checkMissingBreak(clockInResult.billableTime, clockOutResult.billableTime, hasBreak)
      : null;

    // Calculate billable hours
    const billableStart = clockInResult.billableTime;
    const billableEnd = clockOutResult?.billableTime ?? null;

    let billableHours = 0;
    if (billableStart && billableEnd) {
      const startMins = toMinutes(billableStart);
      const endMins = toMinutes(billableEnd);
      const unpaidBreak = shift.unpaidBreakMinutes;
      billableHours = toHours(endMins - startMins - unpaidBreak);
    }

    // Calculate gross pay with penalty rates
    const multiplier = getPenaltyMultiplier(billableStart, shift.date);
    const grossPay = Math.round(billableHours * staffMember.awardRate * multiplier * 100) / 100;

    // Determine current status

    const clockInHappened = clockInEvent && clockInEvent.rawTime <= nowTime;
    const clockOutHappened = clockOutEvent && clockOutEvent.rawTime <= nowTime;
    const breakStartHappened = breakStartEvent && breakStartEvent.rawTime <= nowTime;
    const breakEndHappened = breakEndEvent && breakEndEvent.rawTime <= nowTime;
    
    let status: ProcessedShift['status'] = 'scheduled';
    if (clockInHappened && !clockOutHappened) {
      status = breakStartHappened && !breakEndHappened ? 'on-break' : 'on-floor';
    } else if (clockInHappened && clockOutHappened) {
      status = 'finished';
    }

    return {
      staffId: shift.staffId,
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      role: shift.role,
      scheduledStart: shift.scheduledStart,
      scheduledEnd: shift.scheduledEnd,
      clockInResult,
      clockOutResult,
      breakMissingResult,
      billableStart,
      billableEnd,
      billableHours,
      grossPay,
      status,
    };
  }).filter(Boolean) as ProcessedShift[];
}
// ______________________________________________________________________________
// ─── Summary stats ────────────────────────────────────────────────────────────
// ______________________________________________________________________________

export function getTotalLabourCost(shifts: ProcessedShift[]): number {
  return Math.round(shifts.reduce((sum, s) => sum + s.grossPay, 0) * 100) / 100;
}

export function getStaffOnFloor(shifts: ProcessedShift[]): ProcessedShift[] {
  return shifts.filter(s => s.status === 'on-floor');
}

export function getLabourPct(labourCost: number, totalSales: number): number {
  if (totalSales === 0) return 0;
  return Math.round((labourCost / totalSales) * 1000) / 10;
}

export function getSPLH(totalSales: number, totalLabourHours: number): number {
  if (totalLabourHours === 0) return 0;
  return Math.round((totalSales / totalLabourHours) * 100) / 100;
}

export function getTotalBillableHours(shifts: ProcessedShift[]): number {
  return Math.round(shifts.reduce((sum, s) => sum + s.billableHours, 0) * 100) / 100;
}