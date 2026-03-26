import { venueConfig } from '../data/config';
import { Transaction, todaysTransactions } from '../data/sales';

/**
 * @param transactions - An array of Transaction objects representing all transactions that have occurred today.
 * @returns Get all transactions that have occurred up to the current time today.
 */
export function getAccumulatedTransactions(): Transaction[] {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    return todaysTransactions.filter(t => t.timestamp <= currentTime);
}

/**
 * @param getAccumulatedTransactions - An array of Transaction objects representing all transactions that have occurred up to the current time today.
 * @returns The total sales amount from all transactions that have occurred up to the current time today, rounded to 2 decimal places.
 */
export function getAccumulatedSales(): number {
    return Math.round(getAccumulatedTransactions().reduce((sum, t) => sum + t.total, 0) * 100) / 100;
}

/**
 * 
 * @param hour - The hour (0-23) for which to calculate sales.
 * @returns  The total sales amount from all transactions that occurred during the specified hour today, rounded to 2 decimal places.
 */
export function getSalesForHour(hour: number): number {
    return Math.round(
        todaysTransactions
            .filter(t => parseInt(t.timestamp.split(':')[0]) === hour)
            .reduce((sum, t) => sum + t.total, 0) * 100
    ) / 100;
}


/** Get opening hours */

function getOpeningHours(): number{
    return parseInt(venueConfig.trading.open.split(':')[0]);
}
/** Get closing hours */
function getClosingHours(): number{
    return parseInt(venueConfig.trading.close.split(':')[0]);
}
/** 
 * @params Get hourly sales summary for the current day
 * @returns an array of objects with hour, label, and sales amount for each hour the venue is open.
 */

export function getHourlySalesSummary(): {hour: number, label: string, sales: number}[] {
    const openHour = getOpeningHours();
    const closeHour = getClosingHours();
    const hours = Array.from({length: closeHour - openHour}, (_, i) => i + openHour);
    return hours.map(hour => ({
        hour,
        label: hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`,
        sales: getSalesForHour(hour),
    }));}

/**  */
export function getAccumulatedTransactionCount(): number {
    return getAccumulatedTransactions().length;
}

export function getAvgTransactionValue(): number {
    const txs = getAccumulatedTransactions();
    if (txs.length === 0) return 0;
    return Math.round((getAccumulatedSales() / txs.length) * 100) / 100;

}