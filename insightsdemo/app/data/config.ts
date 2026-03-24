
export const venueConfig = {
    //Venue info 
    name: 'Salspresso',
    servicetype: 'Cafe',
    location: {
        suburb: 'Kingswood',
        state: 'SA',
        country: 'Australia',
        timezone: 'GMT+10:30'
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
          end: '09:00',
        },
        {
          id: 'lunch',
          label: 'Lunch Service',
          start: '09:00',
          end: '14:00',
        },
        {
          id: 'afternoon',
          label: 'Afternoon Service',
          start: '14:00',
          end: '17:00',
        },

      ],
    //Menu items
    menu: [
        {
            name: 'Espresso',
            category: 'Beverage',
            price: 3.00
        },
        {
            name: 'Cappuccino',
            category: 'Beverage',
            price: 4.00
        },
        {
            name: 'Latte',
            category: 'Beverage',
            price: 4.50
        },
        {
            name: 'Muffin',
            category: 'Food',
            price: 2.50
        },
        {
            name: 'Croissant',
            category: 'Food',
            price: 3.00
        }
    ],
    //Labour targets - drives health indicator and alerts
    targets: {
        labourPercentage: 30, // (ceiling threshold) (FORMULA: total labour cost/total sales)*100 -> track that labour expenses are within a healthy range. 
        splh: 65, //(baseline threshold) (FORMULA: total net sales/total labour hours) -> track that the venue is generating enough sales for the labour hours worked.
        overtimeThreshold: 10, // (ceiling threshold) -> track that employees are not working excessive overtime hours.
        lateClockInGrace: 5 //minutes - track that employees are clocking in on time for their shifts.
    },
    //Minimum staff per role per session
    //This is used to drive staffing alerts and recommendations.
    minimumStaff: {
        morning: {
            barista: 2,
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

