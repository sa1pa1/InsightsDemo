/**
 * This file defines the core configuration for the venue,
 * including operating hours, service sessions, menu items, 
 * labour targets, staffing requirements, break rules, minimum engagement rules,
 * and award rates.
 */
export const venueConfig = {
    //Venue info 
    name: 'Salspresso',
    servicetype: 'Cafe',
    location: {
        suburb: 'Kingswood',
        state: 'SA',
        country: 'Australia',
        timezone: 'GMT+10:30',
        lat: -34.9285,
        lng: 138.6007,
    },
    //Operating hours
    trading: {
        open: '06:00',
        close: '17:00'
    },
    //Service Session
    sessions: [
        {
            id: 'morning',
            label: 'Morning Service',
            start: '06:00',
            end: '11:00',
        },
        {
            id: 'lunch',
            label: 'Lunch Service',
            start: '11:00',
            end: '14:00',
        },
        {
            id: 'afternoon',
            label: 'Afternoon Service',
            start: '14:00',
            end: '17:00',
        },

    ],
    //Menu items - realistic menu with categories, pricing, and GST inclusion - consistent with what Square, Lightspeed and Impos export. 
    menu: [
        // Beverages — coffee
        { id: 'bev-001', name: 'Espresso',          category: 'Coffee',      price: 4.00,  gstInclusive: true,  active: true },
        { id: 'bev-002', name: 'Doppio',             category: 'Coffee',      price: 4.50,  gstInclusive: true,  active: true },
        { id: 'bev-003', name: 'Macchiato',          category: 'Coffee',      price: 4.00,  gstInclusive: true,  active: true },
        { id: 'bev-004', name: 'Cappuccino',         category: 'Coffee',      price: 4.80,  gstInclusive: true,  active: true },
        { id: 'bev-005', name: 'Latte',              category: 'Coffee',      price: 4.80,  gstInclusive: true,  active: true },
        { id: 'bev-006', name: 'Flat White',         category: 'Coffee',      price: 4.80,  gstInclusive: true,  active: true },
        { id: 'bev-007', name: 'Long Black',         category: 'Coffee',      price: 4.50,  gstInclusive: true,  active: true },
        { id: 'bev-008', name: 'Mocha',              category: 'Coffee',      price: 5.20,  gstInclusive: true,  active: true },
        { id: 'bev-009', name: 'Cold Brew',          category: 'Coffee',      price: 5.50,  gstInclusive: true,  active: true },
        { id: 'bev-010', name: 'Iced Latte',         category: 'Coffee',      price: 6.00,  gstInclusive: true,  active: true },
      
        // Beverages — other
        { id: 'bev-011', name: 'Chai Latte',         category: 'Beverage',    price: 5.20,  gstInclusive: true,  active: true },
        { id: 'bev-012', name: 'Matcha Latte',       category: 'Beverage',    price: 5.80,  gstInclusive: true,  active: true },
        { id: 'bev-013', name: 'Hot Chocolate',      category: 'Beverage',    price: 5.20,  gstInclusive: true,  active: true },
        { id: 'bev-014', name: 'Fresh Orange Juice', category: 'Beverage',    price: 6.50,  gstInclusive: true,  active: true },
        { id: 'bev-015', name: 'Sparkling Water',    category: 'Beverage',    price: 3.50,  gstInclusive: true,  active: true },
        { id: 'bev-016', name: 'Still Water',        category: 'Beverage',    price: 3.00,  gstInclusive: true,  active: true },
      
        // Milk alternatives (add-on pricing)
        { id: 'add-001', name: 'Oat Milk',           category: 'Add-on',      price: 0.80,  gstInclusive: true,  active: true },
        { id: 'add-002', name: 'Almond Milk',        category: 'Add-on',      price: 0.80,  gstInclusive: true,  active: true },
        { id: 'add-003', name: 'Soy Milk',           category: 'Add-on',      price: 0.80,  gstInclusive: true,  active: true },
        { id: 'add-004', name: 'Extra Shot',         category: 'Add-on',      price: 0.60,  gstInclusive: true,  active: true },
      
        // Food — all-day
        { id: 'food-001', name: 'Croissant',          category: 'Bakery',     price: 5.50,  gstInclusive: false, active: true },
        { id: 'food-002', name: 'Almond Croissant',   category: 'Bakery',     price: 6.50,  gstInclusive: false, active: true },
        { id: 'food-003', name: 'Banana Bread',       category: 'Bakery',     price: 6.00,  gstInclusive: false, active: true },
        { id: 'food-004', name: 'Blueberry Muffin',   category: 'Bakery',     price: 5.50,  gstInclusive: false, active: true },
        { id: 'food-005', name: 'Chocolate Brownie',  category: 'Bakery',     price: 5.50,  gstInclusive: false, active: true },
        { id: 'food-006', name: 'Bircher Muesli',     category: 'Breakfast',  price: 14.00, gstInclusive: false, active: true },
        { id: 'food-007', name: 'Avocado Toast',      category: 'Breakfast',  price: 18.00, gstInclusive: false, active: true },
        { id: 'food-008', name: 'Eggs Benedict',      category: 'Breakfast',  price: 22.00, gstInclusive: false, active: true },
        { id: 'food-009', name: 'Acai Bowl',          category: 'Breakfast',  price: 18.00, gstInclusive: false, active: true },
      
        // Food — lunch
        { id: 'food-010', name: 'Chicken Sandwich',   category: 'Lunch',      price: 16.00, gstInclusive: false, active: true },
        { id: 'food-011', name: 'Beef Burger',        category: 'Lunch',      price: 20.00, gstInclusive: false, active: true },
        { id: 'food-012', name: 'Caesar Salad',       category: 'Lunch',      price: 18.00, gstInclusive: false, active: true },
        { id: 'food-013', name: 'Soup of the Day',    category: 'Lunch',      price: 14.00, gstInclusive: false, active: true },
      ],
    //Labour targets - drives health indicator and alerts
    targets: {
        labourPercentage: 30, // (ceiling threshold) (FORMULA: total labour cost/total sales)*100 -> track that labour expenses are within a healthy range. 
        splh: 65, //(baseline threshold) (FORMULA: total net sales/total labour hours) -> track that the venue is generating enough sales for the labour hours worked.
        overtimeThreshold: 7, // (ceiling threshold) -> track that employees are not working excessive overtime hours.
        lateClockInGrace: 7 //minutes - track that employees are clocking in on time for their shifts.
    },
    //Minimum staff per role per session
    //This is used to drive staffing alerts and recommendations.
    minimumStaff: {
        morning: {
            headBarista: 1,
            barista: 1,
            floor: 1,
            kitchen: 1,
        },
        lunch: {
            barista: 1,
            floor: 2,
            kitchen: 1,
        },
        afternoon: {
            barista: 1,
            floor: 1,
            kitchen: 1,
        },
    },
    // Break rules — AU HIGA hospitality
    breakRules: {
        // Unpaid meal break — required if shift exceeds this many hours
        mealBreak: {
            requiredHours: 5,
            breakDuration: 30,
            paid: false,
        },
        // Paid rest break — one per 4-hour block
        restBreak: {
            requiredAfterHours: 4,
            durationMinutes: 10,
            paid: true,
        },
    },
    /*when we compute billable hours for a staff member, we'll do:
           billable hours = (clockout - clockin) - unpaid break  */
    //Minimum engagement rules — AU HIGA hospitality
    minimumEngagement: {
        casual: {
            minimumShiftHours: 3,    // Can't roster a casual for less than 3 hours
            minimumShiftMinutes: 180,
        },
        partTime: {
            minimumWeeklyHours: 8,   // Guaranteed hours per week in contract
            minimumShiftHours: 3,
        },
        fullTime: {
            minimumWeeklyHours: 38,
            minimumShiftHours: 7.6,  // Standard full-time day
        },
    },

    // Award rates — AU Hospitality Industry General Award
    // Base hourly rates by role
    awardRates: {
        headBarista: 28.50,
        barista: 24.10,
        floor: 23.50,
        kitchen: 22.80,
        manager: 32.00,
    },
    // Penalty rate multipliers by time of day
    penaltyRates: {
        earlyMorning: { before: '07:00', multiplier: 1.15 },
        evening: { after: '18:00', multiplier: 1.15 },
        saturday: { multiplier: 1.25 },
        sunday: { multiplier: 1.50 },
        publicHoliday: { multiplier: 2.25 },
    },
};



//HELPER FUNCTIONS 
// Get current service session based on current time - used to drive session-specific insights and recommendations.
export function getCurrentSession(date: Date) {
    const now = date.getHours() * 60 + date.getMinutes();
    return venueConfig.sessions.find(session => {
        const [sh, sm] = session.start.split(':').map(Number);
        const [eh, em] = session.end.split(':').map(Number);
        const start = sh * 60 + sm;
        const end = eh * 60 + em;
        return now >= start && now < end;
    }) ?? null;
}

//Is the venue currently open? 
// Helper — is the venue currently open
export function isVenueOpen(date: Date) {
    const now = date.getHours() * 60 + date.getMinutes();
    const [oh, om] = venueConfig.trading.open.split(':').map(Number);
    const [ch, cm] = venueConfig.trading.close.split(':').map(Number);
    return now >= oh * 60 + om && now < ch * 60 + cm;
}

