import { venueConfig } from "../../data/config";

interface LabourPctCardProps {
  labourPct: number;
  totalSales: number;
}

export default function LabourPctCard({
  labourPct,
  totalSales,
}: LabourPctCardProps) {
  const target = venueConfig.targets.labourPercentage;
  const colour = labourPct > target * venueConfig.targets.labourPctWarningBuffer
  ? '#E24B4A'
  : labourPct > target
  ? '#EF9F27'
  : '#1D9E75';

  return (
    <div
      style={{
        background: "#111520",
        border: "1px solid #FFFFFF",
        borderRadius: "10px",
        padding: "14px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: "25px",
            fontWeight: "900",
          }}
        >
          Labour % Now
        </span>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: colour,
          }}
        />
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            color: colour,
            fontSize: "52px",
            fontWeight: "900",
            lineHeight: "1",
            fontFamily: "monospace",
          }}
        >
          {totalSales > 0 ? `${labourPct.toFixed(1)}%` : "—"}
        </div>
        <div style={{ color: "#4A5168", fontSize: "16px", marginTop: "6px" }}>
          Target ≤ {target}%
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          background: "#1A1E26",
          borderRadius: "4px",
          height: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "6px",
            borderRadius: "4px",
            background: colour,
            width: `${Math.min((labourPct / target) * 100, 100)}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
