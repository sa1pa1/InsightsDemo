"use client";

import { venueConfig } from "../../data/config";

const pulseStyle = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.6); opacity: 0.4; }
    100% { transform: scale(1); opacity: 1; }
  }
  .pulse-dot {
    animation: pulse 1.5s ease-in-out infinite;
  }
`;

interface LeftPanelProps {
    dateStr: string;
    isOpen: boolean;
    session: { id: string; label: string; start: string; end: string } | null;
}

export default function LeftPanel({
    dateStr,
    isOpen,
    session,
}: LeftPanelProps) {
    return (
        <div
            style={{
                background: "#FFFFFF",
                borderRight: "1px solid #000000",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <style>{pulseStyle}</style>

            {/* Venue block */}
            <div
                style={{
                    height: "150px",
                    background: "#FAE0E0",
                    padding: "0 16px",
                    borderBottom: "1px solid #1E2535",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "3px",
                }}
            >
                <div style={{ color: "#000000", fontSize: "35px", fontWeight: "900" }}>
                    {venueConfig.name}
                </div>
                <div style={{ color: "#4A5168", fontSize: "25px" }}>{dateStr}</div>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        background: isOpen && session ? "#0A2218" : "#1A1E26",
                        border: `1px solid ${isOpen && session ? "#1D9E75" : "#4A5168"}`,
                        borderRadius: "20px",
                        padding: "2px 8px",
                        width: "fit-content",
                    }}
                >
                    <div
                        style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: isOpen && session ? "#1D9E75" : "#4A5168",
                        }}
                        className={isOpen && session ? "pulse-dot" : ""}
                    />
                    <span
                        style={{
                            color: isOpen && session ? "#1D9E75" : "#4A5168",
                            fontSize: "25px",
                            fontWeight: "900",
                        }}
                    >
                        {isOpen && session ? `Live · ${session.label}` : "Closed"}
                    </span>
                </div>
            </div>

            {/* Decision panel */}
            <div
                style={{
                    flex: 1,
                    padding: "16px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <div
                    style={{
                        color: "#342FC1",
                        fontSize: "35px",
                        fontWeight: "900",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                    }}
                >
                    Decision Panel
                </div>
                <div style={{ color: "#4A5168", fontSize: "20px", lineHeight: "1.6" }}>
                    No active alerts. Monitoring service...
                </div>
            </div>
        </div>
    );
}
