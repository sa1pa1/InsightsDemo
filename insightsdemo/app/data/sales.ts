import { venueConfig } from "./config";

export interface TransactionItems { 
    itemId: string;
    itemName: string;
    category: string;
    quantity: number;
    unitPrice: number;
    gstInclusive: boolean;
}

export interface Transaction {
    id: string;
    timestamp: string;
    date: string;
    items: TransactionItems[];
    subtotal: number;
    gst: number;
    total: number;
    paymentMethod: 'card' | 'cash' | 'contactless';
}

function getDate(daysAgo: number = 0): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

/** Subtotal calculation:
 * Loops through every item in the transaction
 * Adds up: unitPrice x quantity
 * Then rounds to 2 decimal places to avoid floating point issues.
 */

function calcSubtotal(items: TransactionItems[]): number {
    return Math.round(items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) * 100) / 100;
}

/** GST calculation:
 * Only runs on items where 'gstIncluusive' is true. 
 * Price = base + GST 
 * Price = base + (base x10%)
 * Price = base x 1.1
 * GST = price/11
 */

function calcGST(items: TransactionItems[]): number {
  return items.reduce((sum, i) => {
    if (i.gstInclusive) return sum + Math.round((i.unitPrice * i.quantity / 11) * 100) / 100;
    return sum;
  }, 0);
}

/**
 * Transaction factory function:
 * Takes in the transaction details and items, calculates subtotal and GST
 * Returns a complete Transaction object.
*/
function tx(
    id: string,
    date: string,
    timestamp: string,
    items: TransactionItems[],
    paymentMethod: 'card' | 'cash' | 'contactless' = 'card'
): Transaction {
    const subtotal = calcSubtotal(items);
    const gst = calcGST(items);
    return { id, timestamp, date, items, subtotal, gst, total: subtotal, paymentMethod };
}

/**
 * Item factory function:
 * Takes in an itemId and quantity,
 * Looks up the item details from the venueConfig menu
 * Returns a TransactionItems object.
 */
const item = (itemId: string, quantity: number = 1): TransactionItems => {
    const menuItem = venueConfig.menu.find(m => m.id === itemId);
    if (!menuItem) {
        throw new Error(`Menu item with id ${itemId} not found`);
    }
    return {
        itemId,
        itemName: menuItem.name,
        category: menuItem.category,
        quantity,
        unitPrice: menuItem.price,
        gstInclusive: menuItem.gstInclusive,
    }
}


const TODAY = getDate(0);

export const todaysTransactions: Transaction[] = [
    // 6am — early regulars
    tx('t001', TODAY, '06:05', [item('bev-006'), item('food-001'), item('bev-005')], 'contactless'),
    tx('t002', TODAY, '06:12', [item('bev-005'), item('add-001'), item('bev-006')], 'card'),
    tx('t003', TODAY, '06:18', [item('bev-007'), item('bev-004')], 'contactless'),
    tx('t004', TODAY, '06:25', [item('bev-004'), item('food-003'), item('bev-005')], 'card'),
    tx('t005', TODAY, '06:31', [item('bev-005', 2), item('food-001', 2), item('food-003')], 'contactless'),
    tx('t006', TODAY, '06:44', [item('bev-006'), item('add-002'), item('bev-007')], 'card'),
    tx('t007', TODAY, '06:52', [item('bev-003'), item('bev-007'), item('bev-006')], 'card'),
    tx('t007b', TODAY, '06:57', [item('bev-006'), item('food-002'), item('bev-005')], 'card'),
  
    // 7am — morning rush
    tx('t008', TODAY, '07:02', [item('bev-005'), item('food-007'), item('bev-006')], 'card'),
    tx('t009', TODAY, '07:08', [item('bev-006', 3), item('food-001', 2)], 'contactless'),
    tx('t010', TODAY, '07:14', [item('bev-004'), item('add-001'), item('food-004'), item('bev-005')], 'card'),
    tx('t011', TODAY, '07:19', [item('bev-010'), item('food-009'), item('bev-006')], 'card'),
    tx('t012', TODAY, '07:23', [item('bev-005'), item('bev-007'), item('food-003'), item('bev-006')], 'contactless'),
    tx('t013', TODAY, '07:28', [item('bev-006', 2), item('add-003'), item('food-001')], 'card'),
    tx('t014', TODAY, '07:33', [item('bev-008'), item('food-005'), item('bev-005')], 'card'),
    tx('t015', TODAY, '07:38', [item('bev-005'), item('bev-004'), item('food-001', 2)], 'contactless'),
    tx('t016', TODAY, '07:44', [item('bev-007', 2), item('bev-006'), item('food-003')], 'card'),
    tx('t017', TODAY, '07:49', [item('bev-011'), item('food-006'), item('bev-005')], 'card'),
    tx('t018', TODAY, '07:54', [item('bev-006', 2), item('add-001'), item('food-002')], 'contactless'),
    tx('t018b', TODAY, '07:57', [item('bev-005'), item('bev-006'), item('food-007'), item('bev-004')], 'card'),
    tx('t018c', TODAY, '07:59', [item('bev-004', 50), item('food-008')], 'card'),
  
    // 8am — peak morning
    tx('t019', TODAY, '08:01', [item('bev-005'), item('bev-006', 2), item('food-007')], 'card'),
    tx('t020', TODAY, '08:06', [item('bev-004', 3), item('food-006'), item('add-001')], 'contactless'),
    tx('t021', TODAY, '08:11', [item('bev-006', 2), item('add-002'), item('food-008')], 'card'),
    tx('t022', TODAY, '08:16', [item('bev-007'), item('bev-005', 2), item('food-001', 2)], 'card'),
    tx('t023', TODAY, '08:21', [item('bev-010'), item('food-009'), item('bev-006')], 'contactless'),
    tx('t024', TODAY, '08:25', [item('bev-005', 2), item('bev-012'), item('food-003')], 'card'),
    tx('t025', TODAY, '08:29', [item('bev-006', 3), item('add-001', 2), item('food-002')], 'card'),
    tx('t026', TODAY, '08:33', [item('bev-008'), item('food-004'), item('bev-005')], 'contactless'),
    tx('t027', TODAY, '08:38', [item('bev-004'), item('bev-005', 2), item('food-007')], 'card'),
    tx('t028', TODAY, '08:43', [item('bev-006', 2), item('add-003'), item('food-006')], 'card'),
    tx('t029', TODAY, '08:48', [item('bev-007', 2), item('bev-006'), item('food-001')], 'contactless'),
    tx('t030', TODAY, '08:53', [item('bev-005'), item('bev-011'), item('food-005'), item('bev-006')], 'card'),
    tx('t031', TODAY, '08:57', [item('bev-006', 2), item('add-001'), item('food-008')], 'card'),
    tx('t031b', TODAY, '08:59', [item('bev-005'), item('bev-004'), item('food-009'), item('bev-006')], 'contactless'),
  
    // 9am — post-rush
    tx('t032', TODAY, '09:04', [item('bev-005', 2), item('food-007')], 'card'),
    tx('t033', TODAY, '09:12', [item('bev-006', 3)], 'contactless'),
    tx('t034', TODAY, '09:19', [item('bev-012'), item('food-006'), item('bev-005')], 'card'),
    tx('t035', TODAY, '09:27', [item('bev-004', 2), item('food-001')], 'card'),
    tx('t036', TODAY, '09:34', [item('bev-010'), item('food-009'), item('bev-006')], 'contactless'),
    tx('t037', TODAY, '09:42', [item('bev-007'), item('bev-005', 2)], 'card'),
    tx('t038', TODAY, '09:51', [item('bev-005', 2), item('add-002'), item('food-003')], 'card'),
    tx('t038b', TODAY, '09:56', [item('bev-006', 2), item('food-007')], 'card'),
  
    // 10am — quiet mid-morning
    tx('t039', TODAY, '10:08', [item('bev-006'), item('food-005'), item('bev-005')], 'card'),
    tx('t040', TODAY, '10:19', [item('bev-011'), item('food-004'), item('bev-006')], 'contactless'),
    tx('t041', TODAY, '10:31', [item('bev-005', 2), item('bev-007')], 'card'),
    tx('t042', TODAY, '10:44', [item('bev-012'), item('food-002'), item('bev-005')], 'card'),
    tx('t043', TODAY, '10:55', [item('bev-006', 2), item('add-001')], 'contactless'),
    tx('t043b', TODAY, '10:58', [item('bev-005'), item('food-003'), item('bev-004')], 'card'),
  
    // 11am
    tx('t044', TODAY, '11:09', [item('bev-005', 2), item('food-001')], 'card'),
    tx('t045', TODAY, '11:22', [item('bev-007', 2), item('bev-006')], 'card'),
    tx('t046', TODAY, '11:38', [item('bev-006', 2), item('food-003')], 'contactless'),
    tx('t047', TODAY, '11:51', [item('bev-004'), item('add-002'), item('food-005'), item('bev-006')], 'card'),
    tx('t047b', TODAY, '11:57', [item('bev-006'), item('food-007'), item('bev-005')], 'card'),
  
    // 12pm — lunch (reduced — Tom no-show)
    tx('t048', TODAY, '12:03', [item('bev-006'), item('food-010'), item('bev-005')], 'card'),
    tx('t049', TODAY, '12:09', [item('bev-005', 2), item('food-011')], 'contactless'),
    tx('t050', TODAY, '12:14', [item('bev-007'), item('food-012'), item('bev-006')], 'card'),
    tx('t051', TODAY, '12:21', [item('bev-006', 2), item('food-010', 2)], 'card'),
    tx('t052', TODAY, '12:28', [item('bev-005'), item('food-013'), item('bev-006')], 'contactless'),
    tx('t053', TODAY, '12:35', [item('bev-004', 2), item('food-012')], 'card'),
    tx('t054', TODAY, '12:44', [item('bev-011'), item('food-011'), item('bev-006')], 'card'),
    tx('t055', TODAY, '12:52', [item('bev-006', 2), item('food-010'), item('add-001')], 'contactless'),
    tx('t055b', TODAY, '12:57', [item('bev-005', 2), item('food-012')], 'card'),
  
    // 1pm — lunch continues
    tx('t056', TODAY, '13:04', [item('bev-005'), item('food-012'), item('bev-006')], 'card'),
    tx('t057', TODAY, '13:14', [item('bev-007', 2), item('food-013')], 'card'),
    tx('t058', TODAY, '13:24', [item('bev-006', 3), item('food-010')], 'contactless'),
    tx('t059', TODAY, '13:35', [item('bev-005', 2), item('food-011')], 'card'),
    tx('t060', TODAY, '13:47', [item('bev-004'), item('add-002'), item('food-012'), item('bev-006')], 'card'),
    tx('t061', TODAY, '13:55', [item('bev-006', 2), item('food-013')], 'contactless'),
    tx('t061b', TODAY, '13:58', [item('bev-005'), item('food-010'), item('bev-006')], 'card'),
  
    // 2pm — afternoon dip
    tx('t062', TODAY, '14:08', [item('bev-010'), item('food-005'), item('bev-006')], 'card'),
    tx('t063', TODAY, '14:22', [item('bev-012'), item('food-004'), item('bev-005')], 'card'),
    tx('t064', TODAY, '14:38', [item('bev-005', 2), item('bev-006')], 'contactless'),
    tx('t065', TODAY, '14:51', [item('bev-011'), item('food-003'), item('bev-006')], 'card'),
  
    // 3pm — slow afternoon
    tx('t066', TODAY, '15:12', [item('bev-006', 2), item('food-001')], 'card'),
    tx('t067', TODAY, '15:34', [item('bev-005'), item('add-001'), item('bev-006')], 'contactless'),
    tx('t068', TODAY, '15:51', [item('bev-007'), item('food-005'), item('bev-005')], 'card'),
  
    // 4pm — closing taper
    tx('t069', TODAY, '16:09', [item('bev-006', 2), item('food-002')], 'card'),
    tx('t070', TODAY, '16:32', [item('bev-005'), item('bev-009'), item('bev-006')], 'contactless'),
    tx('t071', TODAY, '16:48', [item('bev-004', 2), item('food-001')], 'card'),
  ];