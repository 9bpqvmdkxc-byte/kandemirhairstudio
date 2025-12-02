import React, { useState } from "react";
import DatePicker from "../components/DatePicker";

const hours = Array.from({ length: 14 }, (_, i) => 9 + i); // 9-22
const workers = ["⭐ Ömer Kandemir", "Muhammet Ali Kandemir", "Velat Bukan", "Eyüp Özdoğan"];

export default function AdminPanel({ appointments, cancelAppointment, busyHours, setBusyHours, confirmAppointment }) {
  const [kuafor, setKuafor] = useState("⭐ Ömer Kandemir");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);

  // Sadece seçili kuaförün ve seçili tarihin randevuları
  const filteredAppointments = appointments.filter(
    (a) => a.kuafor === kuafor && a.date === selectedDate
  );

  // Meşgul saatler
  const kuaforBusyHours = busyHours[selectedDate]?.[kuafor] || [];

  const toggleBusy = (hour) => {
    setBusyHours((prev) => {
      const prevDay = prev[selectedDate] || {};
      const prevKuafor = prevDay[kuafor] || [];
      let newKuafor;
      if (prevKuafor.includes(hour)) {
        newKuafor = prevKuafor.filter((h) => h !== hour);
      } else {
        newKuafor = [...prevKuafor, hour];
      }
      return {
        ...prev,
        [selectedDate]: {
          ...prevDay,
          [kuafor]: newKuafor,
        },
      };
    });
  };

  return (
    <div>
      <h2 style={{ color: "#ecf0f1", marginBottom: "1.5rem", textAlign: "center" }}>✂️ Müşteri Listesi ✂️</h2>
      
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Çalışan Seç:</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {workers.map((worker) => (
            <button
              key={worker}
              onClick={() => setKuafor(worker)}
              style={{
                background: kuafor === worker ? "#222" : "#e8e8e8",
                color: kuafor === worker ? "#fff" : "#222",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: kuafor === worker ? "bold" : "normal",
                transition: "all 0.2s"
              }}
            >
              {worker}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Tarih Seç:</p>
        <DatePicker value={selectedDate} onChange={(newDate) => {
          setSelectedDate(newDate);
          setSelectedHour(null);
        }} />
      </div>

      <div style={{margin: "1.5rem 0"}}>
        {selectedDate && (
          <>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "0.8rem" }}>Saatler:</p>
            <div style={{display: "flex", flexWrap: "wrap", gap: "6px"}}>
              {hours.map((h) => {
                const hasAppointment = appointments.some(
                  (a) => a.date === selectedDate && a.hour === h && a.kuafor === kuafor
                );
                const isBusy = busyHours[selectedDate]?.[kuafor]?.includes(h) || hasAppointment;
                const selected = selectedHour === h;
                
                // Randevu yapan kişinin baş harflerini bul
                const appointment = appointments.find(
                  (a) => a.date === selectedDate && a.hour === h && a.kuafor === kuafor
                );
                const initials = appointment ? `${appointment.name[0]}.${appointment.surname[0]}` : "";
                
                let bg = "#4caf50";
                let textColor = "#fff";
                
                if (isBusy) {
                  bg = "#e74c3c";
                  textColor = "#fff";
                } else if (selected) {
                  bg = "#f1c40f";
                  textColor = "#222";
                }
                
                return (
                  <button
                    key={h}
                    type="button"
                    style={{
                      background: bg,
                      color: textColor,
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px",
                      minWidth: "70px",
                      cursor: "pointer",
                      fontWeight: selected || isBusy ? "bold" : "normal",
                      transition: "all 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      lineHeight: "1.2"
                    }}
                    onClick={() => setSelectedHour(h)}
                  >
                    <div>{h}:00</div>
                    {initials && <div style={{ fontSize: "10px", marginTop: "2px" }}>{initials}</div>}
                  </button>
                );
              })}
            </div>
          </>
        )}
        
        {selectedDate && selectedHour !== null && (
          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              style={{
                background: busyHours[selectedDate]?.[kuafor]?.includes(selectedHour) ? "#888" : "#f1c40f",
                color: "#222",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onClick={() => {
                setBusyHours((prev) => {
                  const prevDay = prev[selectedDate] || {};
                  const prevKuafor = prevDay[kuafor] || [];
                  let newKuafor;
                  if (prevKuafor.includes(selectedHour)) {
                    newKuafor = prevKuafor.filter((h) => h !== selectedHour);
                  } else {
                    newKuafor = [...prevKuafor, selectedHour];
                  }
                  return {
                    ...prev,
                    [selectedDate]: {
                      ...prevDay,
                      [kuafor]: newKuafor,
                    },
                  };
                });
              }}
            >
              {busyHours[selectedDate]?.[kuafor]?.includes(selectedHour) ? "Meşgulden Çıkar" : "Meşgul Yap"}
            </button>

            <button
              style={{
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onClick={() => {
                setBusyHours((prev) => {
                  const prevDay = prev[selectedDate] || {};
                  const allHours = Array.from({ length: 14 }, (_, i) => 9 + i);
                  return {
                    ...prev,
                    [selectedDate]: {
                      ...prevDay,
                      [kuafor]: allHours,
                    },
                  };
                });
                setSelectedHour(null);
              }}
            >
              🚫 Tüm Gün Kapalı
            </button>

            <button
              style={{
                background: "#27ae60",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onClick={() => {
                setBusyHours((prev) => {
                  const prevDay = prev[selectedDate] || {};
                  return {
                    ...prev,
                    [selectedDate]: {
                      ...prevDay,
                      [kuafor]: [],
                    },
                  };
                });
                setSelectedHour(null);
              }}
            >
              ✅ Tüm Gün Açık
            </button>
          </div>
        )}
      </div>

      <h3 style={{ color: "#ecf0f1", marginTop: "2rem", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #455a64", textAlign: "center" }}>✂️ Randevular ✂️</h3>
      
      {filteredAppointments.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>Randevu yok.</p>
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredAppointments.map((app, idx) => (
          <div
            key={idx}
            style={{
              background: app.status === "confirmed" ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)" : "linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)",
              border: app.status === "confirmed" ? "2px solid #28a745" : "2px solid #ffc107",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                marginBottom: "8px"
              }}>
                <span style={{ 
                  fontWeight: "bold", 
                  fontSize: "1.1rem",
                  background: app.status === "confirmed" ? "#28a745" : "#ffc107",
                  color: app.status === "confirmed" ? "#fff" : "#333",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  minWidth: "100px",
                  textAlign: "center"
                }}>
                  {app.hour}:00
                </span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  {app.date}
                </span>
                <span style={{ 
                  color: app.status === "confirmed" ? "#28a745" : "#ff9800",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  background: app.status === "confirmed" ? "#d4edda" : "#ffe8d6",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  {app.status === "confirmed" ? "✅ Onaylandı" : "⏳ Beklemede"}
                </span>
              </div>
              
              <div style={{ marginLeft: "0px" }}>
                <p style={{ margin: "6px 0", color: "#2d3748", fontWeight: "500" }}>
                  👤 {app.name} {app.surname}
                </p>
                <p style={{ margin: "4px 0", color: "#666", fontSize: "0.95rem" }}>
                  📱 {app.phone}
                </p>
                <p style={{ margin: "4px 0", color: "#555", fontSize: "0.95rem" }}>
                  ✂️ {app.service}
                </p>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginLeft: "16px" }}>
              {app.status !== "confirmed" && (
                <button
                  onClick={() => confirmAppointment(appointments.indexOf(app))}
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap"
                  }}
                  onMouseOver={(e) => e.target.style.background = "#218838"}
                  onMouseOut={(e) => e.target.style.background = "#28a745"}
                >
                  ✅ Onayla
                </button>
              )}
              <button
                onClick={() => cancelAppointment(appointments.indexOf(app))}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
                onMouseOver={(e) => e.target.style.background = "#c0392b"}
                onMouseOut={(e) => e.target.style.background = "#e74c3c"}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}