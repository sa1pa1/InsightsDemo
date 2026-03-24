/**
 * This utility handles clock-in and clock-out rounding logic based on configured rules:
 */

import { venueConfig } from "../data/config";

export type RoundingStatus =
  | 'on-time'      // Clock-in within ±7 mins of scheduled start — no rounding applied (tag: on-time)
  | 'early'        // Clock-in more than 7 mins early — rounded down to prev :15 (tags: early, overtime)
  | 'grace'        // Clock-in within 7 mins late — paid from scheduled start (tag: grace)
  | 'late'         // Clock-in more than 7 mins late — rounded up to next :15 (tag: late)
  | 'overtime'     // Clock-out more than 7 mins late — manager confirmation required (tag: overtime)
  | 'no-show'      // No clock-in recorded for a scheduled shift (tag: no-show)
  | 'missingbreak' // Shift exceeds 5 hours but no break recorded (tag: missing break)
  | 'rounded-down' // Clock-out within 7 mins — rounded down to scheduled end (tags: late, grace)
  | 'rounded-up';  // Clock-out more than 7 mins early — rounded up to next :15 (tags: late, overtime)

export interface RoundingTag {
  label: string;
  colour: 'green' | 'amber' | 'red' | 'blue';
}

export interface RoundingResult {
  rawTime: string;
  billableTime: string;
  status: RoundingStatus;
  deltaMinutes: number;
  message: string;
  tags: RoundingTag[];
}

export const roundingTags: Record<RoundingStatus, RoundingTag[]> = {
  'on-time':      [{ label: 'On time',       colour: 'green' }],
  'early':        [{ label: 'Early',         colour: 'blue'  },
                   { label: 'Overtime',      colour: 'red'   }],
  'grace':        [{ label: 'Grace',         colour: 'green' }],
  'late':         [{ label: 'Late',          colour: 'amber' }],
  'overtime':     [{ label: 'Overtime',      colour: 'red'   }],
  'no-show':      [{ label: 'No show',       colour: 'red'   }],
  'missingbreak': [{ label: 'Missing break', colour: 'amber' }],
  'rounded-down': [{ label: 'Late',          colour: 'amber' },
                   { label: 'Grace',         colour: 'green' }],
  'rounded-up':   [{ label: 'Late',          colour: 'amber' },
                   { label: 'Overtime',      colour: 'red'   }],
};

// Convert HH:MM to total minutes since midnight
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Convert minutes back to HH:MM
function toTime(m: number): string {
  const hours = Math.floor(m / 60);
  const minutes = m % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Round up to next :00 :15 :30 :45
function roundUpToNext15(minutes: number): number {
  return Math.ceil(minutes / 15) * 15;
}

// Round down to previous :00 :15 :30 :45
function roundDownToPrev15(minutes: number): number {
  return Math.floor(minutes / 15) * 15;
}

export function roundClockIn(
  rawTime: string,
  scheduledStart: string,
): RoundingResult {
  const raw = toMinutes(rawTime);
  const scheduled = toMinutes(scheduledStart);
  const diff = raw - scheduled; // positive = late, negative = early
  const window = venueConfig.targets.lateClockInGrace; // 7 mins

  // More than 7 mins early → round down to prev :15
  if (diff < -window) {
    const rounded = roundDownToPrev15(raw);
    return {
      rawTime,
      billableTime: toTime(rounded),
      status: 'early',
      deltaMinutes: scheduled - rounded,
      message: `${Math.abs(diff)} mins early — rounded down to ${toTime(rounded)}`,
      tags: roundingTags['early'],
    };
  }

  // Within 7 mins early → on time, paid from scheduled start
  if (diff < 0 && diff >= -window) {
    return {
      rawTime,
      billableTime: scheduledStart,
      status: 'on-time',
      deltaMinutes: 0,
      message: `${Math.abs(diff)} mins early — within window, paid from ${scheduledStart}`,
      tags: roundingTags['on-time'],
    };
  }

  // Exactly on time
  if (diff === 0) {
    return {
      rawTime,
      billableTime: scheduledStart,
      status: 'on-time',
      deltaMinutes: 0,
      message: `On time — paid from ${scheduledStart}`,
      tags: roundingTags['on-time'],
    };
  }

  // Within 7 mins late → grace, paid from scheduled start
  if (diff > 0 && diff <= window) {
    return {
      rawTime,
      billableTime: scheduledStart,
      status: 'grace',
      deltaMinutes: 0,
      message: `${diff} mins late — within ${window} min grace, paid from ${scheduledStart}`,
      tags: roundingTags['grace'],
    };
  }

  // More than 7 mins late → round up to next :15
  const next15 = roundUpToNext15(raw);
  return {
    rawTime,
    billableTime: toTime(next15),
    status: 'late',
    deltaMinutes: next15 - scheduled,
    message: `${diff} mins late — over grace period, rounded up to ${toTime(next15)}`,
    tags: roundingTags['late'],
  };
}

export function roundClockOut(
  rawTime: string,
  scheduledEnd: string,
): RoundingResult {
  const raw = toMinutes(rawTime);
  const scheduled = toMinutes(scheduledEnd);
  const diff = raw - scheduled; // positive = late, negative = early
  const overtimeThreshold = venueConfig.targets.overtimeThreshold; // 10 mins

  // More than 7 mins early → round up to next :15
  if (diff < -7) {
    const rounded = roundUpToNext15(raw);
    return {
      rawTime,
      billableTime: toTime(rounded),
      status: 'rounded-up',
      deltaMinutes: rounded - scheduled,
      message: `${Math.abs(diff)} mins early — rounded up to ${toTime(rounded)}`,
      tags: roundingTags['rounded-up'],
    };
  }

  // Within 7 mins early OR on time OR within 10 mins late → paid to scheduled end
  if (diff >= -7 && diff <= overtimeThreshold) {
    const status = diff > 0 ? 'rounded-down' : 'on-time';
    return {
      rawTime,
      billableTime: scheduledEnd,
      status,
      deltaMinutes: 0,
      message: diff < 0
        ? `${Math.abs(diff)} mins early — within window, paid to ${scheduledEnd}`
        : diff === 0
        ? `On time — paid to ${scheduledEnd}`
        : `${diff} mins late — within threshold, rounded down to ${scheduledEnd}`,
      tags: roundingTags[status],
    };
  }

  // More than 10 mins late → overtime flag, manager confirmation required
  return {
    rawTime,
    billableTime: rawTime,
    status: 'overtime',
    deltaMinutes: diff,
    message: `${diff} mins past scheduled end — overtime confirmation required`,
    tags: roundingTags['overtime'],
  };
}

// Check if a shift is missing a required break
export function checkMissingBreak(
  clockInTime: string,
  clockOutTime: string,
  hasBreakRecorded: boolean,
): RoundingResult | null {
  const shiftHours = (toMinutes(clockOutTime) - toMinutes(clockInTime)) / 60;
  const requiredAfterHours = venueConfig.breakRules.mealBreak.requiredHours;

  if (shiftHours >= requiredAfterHours && !hasBreakRecorded) {
    return {
      rawTime: clockOutTime,
      billableTime: clockOutTime,
      status: 'missingbreak',
      deltaMinutes: 0,
      message: `Shift is ${shiftHours.toFixed(1)} hrs — meal break required but not recorded`,
      tags: roundingTags['missingbreak'],
    };
  }

  return null;
}