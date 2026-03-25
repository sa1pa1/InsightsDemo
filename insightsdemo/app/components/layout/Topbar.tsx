'use client';

interface TopbarProps {
    time: string;
}

export default function Topbar({ time }: TopbarProps) {
    return (
        <div style={{
            background: "#111520",
            borderBottom: "1px solid #FFFFFF",
            height: "150px",
            flexShrink: 0,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{
                    color: "#E8E4DC",
                    fontSize: "80px",
                    fontWeight: "900",
                    letterSpacing: "-0.02em",
                }}>
                    INSIGHTSDEMO
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        background: "#1D9E75",
                    }} />
                    <span style={{
                        color: "#9AA0B4",
                        fontSize: "45px",
                    }}>
                        {time}
                    </span>
                </div>
            </div>
            <button style={{
                background: "#0A2218",
                border: "1px solid #1D9E75",
                borderRadius: "6px",
                padding: "8px 18px",
                color: "#1D9E75",
                fontSize: "30px",
                fontWeight: "900",
                cursor: "pointer",
            }}>
                ▶ Simulate Service
            </button>
        </div>
    );
}