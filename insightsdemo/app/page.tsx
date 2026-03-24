"use client";
import { venueConfig, getCurrentSession, isVenueOpen } from "./data/config";
import { useState, useEffect } from "react";
import { processShifts, getTotalLabourCost } from "./lib/shiftcalculations";
import { fetchWeather, WeatherData } from "./lib/weather";
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

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(() => fetchWeather().then(setWeather), 300000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  const shifts = processShifts();
  const [session, setSession] = useState<{
    id: string;
    label: string;
    start: string;
    end: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setSession(getCurrentSession(now));
      setIsOpen(isVenueOpen(now));
    };
    update();
    const interval = setInterval(update, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDateStr(
        now.toLocaleDateString("en-AU", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      style={{
        background: "#0B0D14",
        height: "100vh",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "400px 1fr",
      }}
    >
      {/* Left panel */}
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
          <div
            style={{ color: "#000000", fontSize: "35px", fontWeight: "900" }}
          >
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
          <div
            style={{ color: "#4A5168", fontSize: "20px", lineHeight: "1.6" }}
          >
            No active alerts. Monitoring service...
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Topbar*/}
        <div
          style={{
            background: "#111520",
            borderBottom: "1px solid #FFFFFF",
            height: "150px",
            flexShrink: 0,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                color: "#E8E4DC",
                fontSize: "80px",
                fontWeight: "900",
                letterSpacing: "-0.02em",
              }}
            >
              INSIGHTSDEMO
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "#1D9E75",
                }}
              />
              <span
                style={{
                  color: "#9AA0B4",
                  fontSize: "45px",
                }}
              >
                {time}
              </span>
            </div>
          </div>
          <button
            style={{
              background: "#0A2218",
              border: "1px solid #1D9E75",
              borderRadius: "6px",
              padding: "8px 18px",
              color: "#1D9E75",
              fontSize: "30px",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            ▶ Simulate Service
          </button>
        </div>

        {/*Main content*/}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gridTemplateRows: "auto 1fr",
            padding: "12px",
            gap: "12px",
          }}
        >
          {/* Basic Stats Row */}
          <div
            style={{
              gridColumn: "1 / 2",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            {["Labour % Now", "SPLH Live", "Staff on Floor"].map((label) => (
              <div
                key={label}
                style={{
                  background: "#111520",
                  border: "1px solid #FFFFFF",
                  borderRadius: "10px",
                  padding: "14px",
                  height: "200px",
                }}
              >
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "25px",
                    fontWeight: "900",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
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
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "25px",
                  fontWeight: "900",
                }}
              >
                Weather · {venueConfig.location.suburb}
              </span>
              {weather ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontSize: "48px",
                        fontWeight: "900",
                        lineHeight: "1",
                      }}
                    >
                      {weather.temperature}°C
                    </span>
                    <span style={{ fontSize: "32px", marginBottom: "4px" }}>
                      {weather.icon}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span style={{ color: "#9AA0B4", fontSize: "18px" }}>
                      {weather.description}
                    </span>
                    <span style={{ color: "#4A5168", fontSize: "16px" }}>
                      Wind {weather.windSpeed} km/h
                    </span>
                  </div>
                </>
              ) : (
                <span style={{ color: "#4A5168", fontSize: "18px" }}>
                  Loading weather...
                </span>
              )}
            </div>
          </div>

          {/* Right column */}
          <div
            style={{
              gridColumn: "2 / 3",
              gridRow: "1 / 3",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Alert Feed card */}
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
                  color: "#FFFFFF",
                  fontSize: "25px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Alert Feed
              </p>
              <div style={{ height: "1px", background: "#1E2535" }} />
              {/* alert feed content here */}
            </div>

            {/* Roster card */}
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
                  color: "#FFFFFF",
                  fontSize: "25px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Roster — Today
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
                  {/* Name + status */}
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
                      {shift.firstName} {shift.lastName}
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
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
                            : shift.status === "finished"
                            ? "#1A1E26"
                            : "#1A1E26",
                        color:
                          shift.status === "no-show"
                            ? "#E24B4A"
                            : shift.status === "on-floor"
                            ? "#1D9E75"
                            : shift.status === "on-break"
                            ? "#EF9F27"
                            : shift.status === "finished"
                            ? "#4A5168"
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

                  {/* Role + hours */}
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
                    <span
                      style={{
                        color: "#4A5168",
                        fontSize: "20px",
                      
                      }}
                    >
                      {shift.scheduledStart} – {shift.scheduledEnd}
                    </span>
                  </div>

                  {/* Rounding tags */}
                  {/* Clock-in rounding tags */}
                  {shift.clockInResult && (
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                        marginTop: "2px",
                      }}
                    >
                      <span
                        style={{
                          color: "#4A5168",
                          fontSize: "16px",
                          
                        }}
                      >
                        IN:
                      </span>
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
                      <span
                        style={{
                          color: "#4A5168",
                          fontSize: "16px",
                        }}
                      >
                        {shift.clockInResult.rawTime} →{" "}
                        {shift.clockInResult.billableTime}
                      </span>
                    </div>
                  )}

                  {/* Clock-out rounding tags */}
                  {shift.clockOutResult && (
                    <div
                      style={{
                        display: "flex",
                        gap: "4px",
                        flexWrap: "wrap",
                        marginTop: "2px",
                      }}
                    >
                      <span
                        style={{
                          color: "#4A5168",
                          fontSize: "16px",
                        }}
                      >
                        OUT:
                      </span>
                      {shift.clockOutResult.tags.map((tag, i) => (
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
                      <span
                        style={{
                          color: "#4A5168",
                          fontSize: "16px",
                        }}
                      >
                        {shift.clockOutResult.rawTime} →{" "}
                        {shift.clockOutResult.billableTime}
                      </span>
                    </div>
                  )}

                  {/* Billable hours + gross pay */}
                  {shift.billableHours > 0 && (
                    <div
                      style={{
                        color: "#4A5168",
                        fontSize: "18px",
                      }}
                    >
                      {shift.billableHours}h billable · $
                      {shift.grossPay.toFixed(2)}
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

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "#1E2535",
                  marginTop: "8px",
                }}
              />

              {/* Est. Labour Cost */}
              <div style={{ paddingTop: "8px" }}>
                <p
                  style={{
                    color: "#FFFFFF",
                    fontSize: "25px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "6px",
                  }}
                >
                  Est. Labour Cost
                </p>
                <p
                  style={{
                    color: "#E8E4DC",
                    fontSize: "50px",
                    fontWeight: "900",
                    lineHeight: "1",
                  }}
                >
                  ${getTotalLabourCost(shifts).toFixed(2)}
                </p>
                <p
                  style={{
                    color: "#4A5168",
                    fontSize: "18px",
                    marginTop: "4px",
                  }}
                >
                  Today so far ·{" "}
                  {shifts.filter((s) => s.status !== "no-show").length} staff
                </p>
              </div>
            </div>
          </div>

          {/* Heatmap + Master Graph */}
          <div
            style={{
              gridColumn: "1 / 2",
              display: "grid",
              gridTemplateColumns: "1fr 1.8fr",
              gap: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#111520",
                border: "1px solid #FFFFFF",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: "#FFFFFF",
                  fontSize: "25px",
                  fontWeight: "900",
                }}
              >
                Weekly Performance Indicator
              </p>
            </div>
            <div
              style={{
                background: "#111520",
                border: "1px solid #FFFFFF",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <p
                style={{
                  color: "#FFFFFF",
                  fontSize: "25px",
                  fontWeight: "900",
                }}
              >
                Master Graph
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
