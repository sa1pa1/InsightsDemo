"use client";

import { WeatherData, publicHoliday } from "@/app/lib/weather";
import { venueConfig } from "@/app/data/config";

// Simple card component to display current weather and upcoming public holidays.
interface WeatherCardProps {
  weather: WeatherData | null;
  holidays: publicHoliday[] | null;
}

export default function WeatherCard({ weather, holidays }: WeatherCardProps) {
  return (
    <div
      //card style
      className="WeatherCard"
      style={{
        background: "#111520",
        border: "1px solid #FFFFFF",
        borderRadius: "10px",
        padding: "14px",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* header */}
      <span style={{ color: "#FFFFFF", fontSize: "25px", fontWeight: "900" }}>
        Weather · {venueConfig.location.suburb}
      </span>
      {/* info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          flex: 1,
        }}
      >
        {/* weather info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {weather ? (
            <>
              <div
                style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}
              >
                {/*Temperature*/}
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "50px",
                    fontWeight: "900",
                    lineHeight: "1",
                  }}
                >
                  {weather?.temperature}°C
                </span>

                {/*Weather icon*/}
                <span style={{ fontSize: "28px", marginBottom: "2px" }}>
                  {weather?.icon}
                </span>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span style={{ fontSize: "15px", color: "#9AA0B4" }}>
                  {" "}
                  {weather?.description}
                </span>
                <span style={{ fontSize: "15px", color: "#FFFFFF" }}>
                  {" "}
                  {weather?.windSpeed} km/h
                </span>
              </div>
            </>
          ) : (
            <span style={{ color: "#FFFFFF", fontSize: "15px" }}>
              Weather data unavailable
            </span>
          )}
        </div>
        {/*Holidays*/}
        <div
          style={{
            borderLeft: "1px solid #FFFFFFF",
            paddingLeft: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span
            style={{
              color: "#9AA0B4",
              fontSize: "14px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Public Holidays
          </span>
          {holidays && holidays.length > 0 ? (
            holidays?.map((h, i) => (
              <div
                key={i}
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
              >
                <span
                  style={{
                    color: h.isToday ? "#E24B4A" : "#EF9F27",
                    fontSize: "10px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                  }}
                >
                  {h.isToday ? "Today" : "This week"}
                </span>
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: "900",
                  }}
                >
                  {h.name}
                </span>
                <span style={{ color: "#4A5168", fontSize: "12px" }}>
                  {h.date}
                </span>
              </div>
            ))
          ) : (
            <span style={{ color: "#4A5168", fontSize: "14px" }}>
              No holidays this week
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
