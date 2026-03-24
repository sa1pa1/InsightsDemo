/**
 * This file contains the staff data for the cafe. 
 * Each staff member has an id, first name, last name, role, employment type, and award rate.
 */
export type EmploymentType = 'casual' | 'part-time' | 'full-time';
export type StaffRole = 'head-barista' | 'barista' | 'floor' | 'kitchen';

export interface StaffMember {
    id: string;
    firstName: string;
    lastName: string;
    role: StaffRole;
    employmentType: EmploymentType;
    awardRate: number;
}

export const staff: StaffMember[] = [
    { id: 's1', firstName: 'Mia', lastName: 'Bui', role: 'head-barista', employmentType: 'full-time', awardRate: 28.50 },
    { id: 's2', firstName: 'Kathy', lastName: 'Chen', role: 'barista', employmentType: 'casual', awardRate: 24.10 },
    { id: 's3', firstName: 'Sally', lastName: 'Bui', role: 'floor', employmentType: 'part-time', awardRate: 23.50 },
    { id: 's4', firstName: 'Jason', lastName: 'Ly', role: 'kitchen', employmentType: 'casual', awardRate: 22.80 },
    { id: 's5', firstName: 'Sarah', lastName: 'Pham', role: 'floor', employmentType: 'casual', awardRate: 23.50 },
    { id: 's6', firstName: 'Justin', lastName: 'Smith', role: 'barista', employmentType: 'casual', awardRate: 24.10 },
];
