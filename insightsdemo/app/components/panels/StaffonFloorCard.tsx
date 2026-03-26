import { venueConfig } from '../../data/config';
import { ProcessedShift } from '../../lib/shiftcalculations';

interface StaffOnFloorCardProps {
  shifts: ProcessedShift[];
}

export default function StaffOnFloorCard({ shifts }: StaffOnFloorCardProps) {
  const now = new Date();
  const currentHour = now.getHours();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const staffOnFloor = shifts.filter(s => s.status === 'on-floor').length;
  const staffOnBreak = shifts.filter(s => s.status === 'on-break').length;
  const staffNoShow = shifts.filter(s => s.status === 'no-show').length;
  const staffScheduled = shifts.filter(s => s.status === 'scheduled').length;

  // Only count staff whose shift overlaps with current time
  const currentlyScheduled = shifts.filter(s => {
    const [sh, sm] = s.scheduledStart.split(':').map(Number);
    const [eh, em] = s.scheduledEnd.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return nowMinutes >= start && nowMinutes < end;
  }).length;

  const { minimumStaff, sessions } = venueConfig;

  // Find current session
  const currentSession = sessions.find(session => {
    const [sh] = session.start.split(':').map(Number);
    const [eh] = session.end.split(':').map(Number);
    return currentHour >= sh && currentHour < eh;
  });

  // Get minimum staff for current session
  const minStaff = currentSession
    ? Object.values(minimumStaff[currentSession.id as keyof typeof minimumStaff] ?? {}).reduce((a, b) => a + b, 0)
    : 0;

  const belowMinimum = minStaff - staffOnFloor;

  const colour = belowMinimum >= 2
    ? '#E24B4A'
    : belowMinimum === 1
    ? '#EF9F27'
    : '#1D9E75';

  return (
    <div style={{
      background: "#111520",
      border: "1px solid #FFFFFF",
      borderRadius: "10px",
      padding: "14px",
      height: "200px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span
          style={{
            color: "#FFFFFF",
            fontSize: "25px",
            fontWeight: "900",
            textTransform: "uppercase",
          }}
        >
          Staff on Floor
        </span>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: colour,
        }} />
      </div>

      {/* Count */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
        <div style={{
          color: colour,
          fontSize: "52px",
          fontWeight: "900",
          lineHeight: "1",
          fontFamily: "monospace",
        }}>
          {staffOnFloor}
        </div>
        <div style={{ color: "#4A5168", fontSize: "25px", marginBottom: "6px" }}>
          of {currentlyScheduled} scheduled now
        </div>
      </div>

      {/* Status breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {staffOnBreak > 0 && (
          <div style={{ color: "#EF9F27", fontSize: "20px" }}>
            {staffOnBreak} on break
          </div>
        )}
        {staffNoShow > 0 && (
          <div style={{ color: "#E24B4A", fontSize: "20px" }}>
            {staffNoShow} no-show
          </div>
        )}
        {staffScheduled > 0 && (
          <div style={{ color: "#4A5168", fontSize: "20px" }}>
            {staffScheduled} not started yet
          </div>
        )}
        {belowMinimum >= 2 && (
          <div style={{ color: "#E24B4A", fontSize: "20px" }}>
            {belowMinimum} below minimum for {currentSession?.label ?? 'current session'}
          </div>
        )}
        {belowMinimum === 1 && (
          <div style={{ color: "#EF9F27", fontSize: "20px" }}>
            1 below minimum for {currentSession?.label ?? 'current session'}
          </div>
        )}
        {belowMinimum <= 0 && staffNoShow === 0 && staffOnBreak === 0 && staffScheduled === 0 && (
          <div style={{ color: "#1D9E75", fontSize: "20px" }}>
            At minimum staffing
          </div>
        )}
      </div>

    </div>
  );
}