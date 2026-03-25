import { ProcessedShift } from "@/app/lib/shiftcalculations";

interface RosterCardProps {
    shifts: ProcessedShift[];
    totalLabourCost: number;
}

export default function RosterCard({
    shifts,
    totalLabourCost,
}: RosterCardProps) {
    return (
        <div
            style={{
                background: "#111520",
                border: "1px solid #FFFFFF",
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
                overflowY: "auto",
            }}
        >
            <p
                style={{
                    color: "#FFFFFFF",
                    fontSize: "25px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                }}
            >
                Roster Today
            </p>
            <div style={{ height: "1px", background: "#1E2535" }} />
            {shifts.map((shift) => (
                <div
                    key={shift.staffId}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        padding: "8px 0",
                        borderBottom: "1px solid #1E2535",
                    }}
                >
                    {/**Name + Status */}
                    <div>
                        <span
                            style={{ color: "#FFFFFF", fontSize: "25px", fontWeight: "900" }}
                        >
                            {shift.firstName} {shift.lastName}{" "}
                        </span>
                        {/**Status Tags */}
                        <span
                            style={{
                                fontSize: "20px",
                                fontWeight: "500",
                                padding: "2px 10px",
                                borderRadius: "4px",
                                background:
                                    shift.status === "no-show"
                                        ? "#2A0F0F"
                                        : shift.status === "on-floor"
                                            ? "#0A2218"
                                            : shift.status === "on-break"
                                                ? "#2A1E08"
                                                : "#1A1E26",
                                color:
                                    shift.status === "no-show"
                                        ? "#E24B4A"
                                        : shift.status === "on-floor"
                                            ? "#1D9E75"
                                            : shift.status === "on-break"
                                                ? "#EF9F27"
                                                : "#4A5168",
                            }}
                        >
                            {shift.status === "no-show"
                                ? "No show"
                                : shift.status === "on-floor"
                                    ? "On floor"
                                    : shift.status === "on-break"
                                        ? "On break"
                                        : shift.status === "finished"
                                            ? "Finished"
                                            : "Scheduled"}
                        </span>
                    </div>

                    {/**Roles + hours*/}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                color: "#4A5168",
                                fontSize: "20px",
                                textTransform: "capitalize",
                            }}
                        >
                            {shift.role.replace("-", " ")}
                        </span>
                        <span style={{ color: "#4A5168", fontSize: "20px" }}>
                            {shift.scheduledStart} – {shift.scheduledEnd}
                        </span>
                    </div>

                    {/* Clock-in tags */}
                    {shift.clockInResult && (
                        <div
                            style={{
                                display: "flex",
                                gap: "4px",
                                flexWrap: "wrap",
                                marginTop: "2px",
                            }}
                        >
                            <span style={{ color: "#4A5168", fontSize: "16px" }}>IN:</span>
                            {shift.clockInResult.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        padding: "2px 8px",
                                        borderRadius: "3px",
                                        background:
                                            tag.colour === "green"
                                                ? "#0A2218"
                                                : tag.colour === "amber"
                                                    ? "#2A1E08"
                                                    : tag.colour === "red"
                                                        ? "#2A0F0F"
                                                        : "#0D1F3D",
                                        color:
                                            tag.colour === "green"
                                                ? "#1D9E75"
                                                : tag.colour === "amber"
                                                    ? "#EF9F27"
                                                    : tag.colour === "red"
                                                        ? "#E24B4A"
                                                        : "#378ADD",
                                    }}
                                >
                                    {tag.label}
                                </span>
                            ))}
                            <span style={{ color: "#4A5168", fontSize: "16px" }}>
                                {shift.clockInResult.rawTime} →{" "}
                                {shift.clockInResult.billableTime}
                            </span>
                        </div>
                    )}

                    {/* Clock-out tags */}
                    {shift.clockOutResult && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "2px" }}>
                            <span style={{ color: "#4A5168", fontSize: "16px" }}>OUT:</span>
                            {shift.clockOutResult.tags.map((tag, i) => (
                                <span key={i} style={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    padding: "2px 8px",
                                    borderRadius: "3px",
                                    background: tag.colour === "green" ? "#0A2218"
                                        : tag.colour === "amber" ? "#2A1E08"
                                            : tag.colour === "red" ? "#2A0F0F"
                                                : "#0D1F3D",
                                    color: tag.colour === "green" ? "#1D9E75"
                                        : tag.colour === "amber" ? "#EF9F27"
                                            : tag.colour === "red" ? "#E24B4A"
                                                : "#378ADD",
                                }}>
                                    {tag.label}
                                </span>
                            ))}
                            <span style={{ color: "#4A5168", fontSize: "16px" }}>
                                {shift.clockOutResult.rawTime} → {shift.clockOutResult.billableTime}
                            </span>
                        </div>
                    )}

                    {/* Billable hours + gross pay */}
                    {shift.billableHours > 0 && (
                        <div style={{ color: "#4A5168", fontSize: "18px" }}>
                            {shift.billableHours}h billable · ${shift.grossPay.toFixed(2)}
                        </div>
                    )}

                    {/* Missing break warning */}
                    {shift.breakMissingResult && (
                        <div style={{ color: "#EF9F27", fontSize: "18px" }}>
                            ⚠ {shift.breakMissingResult.message}
                        </div>
                    )}
                </div>
            ))}

            {/* Est. Labour Cost */}
            <div style={{ height: "1px", background: "#1E2535", marginTop: "8px" }} />
            <div style={{ paddingTop: "8px" }}>
                <p style={{ color: "#FFFFFF", fontSize: "25px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                    Est. Labour Cost
                </p>
                <p style={{ color: "#E8E4DC", fontSize: "50px", fontWeight: "900", lineHeight: "1" }}>
                    ${totalLabourCost.toFixed(2)}
                </p>
                <p style={{ color: "#4A5168", fontSize: "18px", marginTop: "4px" }}>
                    Today so far · {shifts.filter(s => s.status !== "no-show").length} staff
                </p>
            </div>

        </div>
    );
}
