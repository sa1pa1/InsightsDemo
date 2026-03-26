"use client";

import { useState, useEffect } from "react";
import { getCurrentSession, isVenueOpen } from "./data/config";
import { processShifts, getTotalLabourCost } from "./lib/shiftcalculations";
import {
  fetchWeather,
  fetchPublicHolidays,
  WeatherData,
  publicHoliday,
} from "./lib/weather";
import LeftPanel from "./components/layout/LeftPanel";
import Topbar from "./components/layout/Topbar";
import WeatherCard from "./components/panels/WeatherCard";
import RosterCard from "./components/panels/RosterCard";

export default function Home() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [session, setSession] = useState<{
    id: string;
    label: string;
    start: string;
    end: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [holidays, setHolidays] = useState<publicHoliday[]>([]);

  const [shifts, setShifts] = useState(() => processShifts());
  const [totalLabourCost, setTotalLabourCost] = useState(() =>
    getTotalLabourCost(processShifts())
  );

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
      setSession(getCurrentSession(now));
      setIsOpen(isVenueOpen(now));

      // Recalculate shifts every minute
      if (now.getSeconds() === 0) {
        const updated = processShifts();
        setShifts(updated);
        setTotalLabourCost(getTotalLabourCost(updated));
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWeather().then(setWeather);
    const interval = setInterval(() => fetchWeather().then(setWeather), 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPublicHolidays().then(setHolidays);
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
      <LeftPanel dateStr={dateStr} isOpen={isOpen} session={session} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Topbar time={time} />

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
          {/* Stats row */}
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
            <WeatherCard weather={weather} holidays={holidays} />
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
            {/* Alert feed */}
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
            </div>

            <RosterCard shifts={shifts} totalLabourCost={totalLabourCost} />
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
