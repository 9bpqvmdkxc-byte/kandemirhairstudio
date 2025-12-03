import React, { useState } from "react";
import DatePicker from "../components/DatePicker";

const hours = Array.from({ length: 14 }, (_, i) => 9 + i); // 9-22
const workers = ["⭐ Ömer Kandemir", "Muhammet Ali Kandemir", "Velat Bukan", "Eyüp Özdoğan"];

export default function AdminPanel({ appointments, cancelAppointment, busyHours, setBusyHours, confirmAppointment }) {
  const [kuafor, setKuafor] = useState("⭐ Ömer Kandemir");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [calledCustomers, setCalledCustomers] = useState({}); // Çağrılan müşteriler

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

  // Müşteri geçmişini hesapla (sadece onaylanan randevular)
  const customerHistory = {};
  appointments.forEach((app) => {
    // Sadece onaylanan randevuları say
    if (app.status !== "confirmed") return;
    
    const customerName = `${app.name} ${app.surname}`;
    if (!customerHistory[customerName]) {
      customerHistory[customerName] = {
        count: 0,
        phone: app.phone,
        services: [],
        lastVisit: null
      };
    }
    customerHistory[customerName].count++;
    if (app.service && !customerHistory[customerName].services.includes(app.service)) {
      customerHistory[customerName].services.push(app.service);
    }
    // Son ziyareti güncelle
    if (!customerHistory[customerName].lastVisit || new Date(app.date) > new Date(customerHistory[customerName].lastVisit)) {
      customerHistory[customerName].lastVisit = app.date;
    }
  });

  // Sıralanmış müşteri listesi (en çok gelenlerin başında)
  const sortedCustomers = Object.entries(customerHistory)
    .sort((a, b) => b[1].count - a[1].count);

  // 1 aydan fazla süredir gelmeyen müşteriler
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const inactiveCustomers = Object.entries(customerHistory)
    .filter(([customerName, data]) => {
      // Eğer zaten çağrıldıysa listeden çıkar
      if (calledCustomers[customerName]) return false;
      if (!data.lastVisit) return false;
      const lastVisitDate = new Date(data.lastVisit);
      return lastVisitDate < oneMonthAgo;
    })
    .sort((a, b) => new Date(a[1].lastVisit) - new Date(b[1].lastVisit));

  // Müşteri çağır
  const markAsCalled = (customerName) => {
    setCalledCustomers(prev => ({
      ...prev,
      [customerName]: true
    }));
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
        {filteredAppointments.map((app, idx) => {
          // Müşterinin toplam ziyaret sayısını bul
          const customerName = `${app.name} ${app.surname}`;
          const visitCount = customerHistory[customerName]?.count || 0;
          
          return (
          <div
            key={idx}
            style={{
              background: app.status === "confirmed" ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)" : "linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)",
              border: app.status === "confirmed" ? "2px solid #28a745" : "2px solid #ffc107",
              borderRadius: "10px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
              position: "relative"
            }}
          >
            {/* Ziyaret Sayısı - Sağ Üst Köşe */}
            {visitCount > 0 && (
              <div style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: app.status === "confirmed" ? "#28a745" : "#ffc107",
                color: app.status === "confirmed" ? "#fff" : "#333",
                padding: "8px 14px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "0.9rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}>
                ✂️ {visitCount}x
              </div>
            )}
            
            {/* Üst kısım: Bilgiler - Sağ tarafta padding ekle */}
            <div style={{ paddingRight: visitCount > 0 ? "90px" : "0" }}>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px",
                marginBottom: "10px",
                flexWrap: "wrap"
              }}>
                <span style={{ 
                  fontWeight: "bold", 
                  fontSize: "1.1rem",
                  background: app.status === "confirmed" ? "#28a745" : "#ffc107",
                  color: app.status === "confirmed" ? "#fff" : "#333",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  minWidth: "90px",
                  textAlign: "center"
                }}>
                  {app.hour}:00
                </span>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  📅 {app.date}
                </span>
                <span style={{ 
                  color: app.status === "confirmed" ? "#28a745" : "#ff9800",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  background: app.status === "confirmed" ? "#d4edda" : "#ffe8d6",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  marginLeft: "auto"
                }}>
                  {app.status === "confirmed" ? "✅ Onaylandı" : "⏳ Beklemede"}
                </span>
              </div>
              
              <div>
                <p style={{ margin: "6px 0", color: "#2d3748", fontWeight: "600", fontSize: "1rem" }}>
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

            {/* Alt kısım: Butonlar */}
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              justifyContent: "flex-end",
              paddingTop: "8px",
              borderTop: app.status === "confirmed" ? "1px solid rgba(40, 167, 69, 0.2)" : "1px solid rgba(255, 193, 7, 0.3)",
              flexWrap: "wrap"
            }}>
              {app.status !== "confirmed" && (
                <button
                  onClick={() => confirmAppointment(appointments.indexOf(app))}
                  style={{
                    background: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                    fontSize: "0.95rem"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#218838";
                    e.target.style.boxShadow = "0 2px 6px rgba(33, 136, 56, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#28a745";
                    e.target.style.boxShadow = "none";
                  }}
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
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  fontSize: "0.95rem"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#c0392b";
                  e.target.style.boxShadow = "0 2px 6px rgba(192, 57, 43, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#e74c3c";
                  e.target.style.boxShadow = "none";
                }}
              >
                🗑️ Sil
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal: 1 Aydan Fazla Süredir Gelmeyen Müşteriler */}
      {inactiveCustomers.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)",
          borderRadius: "12px",
          padding: "1.5rem",
          marginTop: "3rem",
          border: "2px solid #f5c6cb"
        }}>
          <h3 style={{ color: "#721c24", marginBottom: "1.5rem", marginTop: "0", paddingBottom: "1rem", borderBottom: "2px solid #f5c6cb", textAlign: "center" }}>
            ⚠️ 1 Aydan Fazla Süredir Gelmeyen Müşteriler ({inactiveCustomers.length})
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
            {inactiveCustomers.map(([customerName, data]) => {
              const lastVisitDate = new Date(data.lastVisit);
              const daysSinceVisit = Math.floor((today - lastVisitDate) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={customerName}
                  style={{
                    background: "#fff",
                    border: "2px solid #f5c6cb",
                    borderRadius: "8px",
                    padding: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0", fontWeight: "bold", color: "#721c24", fontSize: "1rem" }}>
                        {customerName}
                      </p>
                    </div>
                    <span style={{
                      background: "#f8d7da",
                      color: "#721c24",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap"
                    }}>
                      {daysSinceVisit} gün
                    </span>
                  </div>
                  
                  <p style={{ margin: "0", color: "#666", fontSize: "0.85rem" }}>
                    📱 {data.phone}
                  </p>
                  
                  <p style={{ margin: "0", color: "#856404", fontSize: "0.85rem", background: "#fff3cd", padding: "6px 8px", borderRadius: "4px" }}>
                    📅 {new Date(data.lastVisit).toLocaleDateString("tr-TR")}
                  </p>
                  
                  {data.services.length > 0 && (
                    <p style={{ margin: "0", color: "#555", fontSize: "0.85rem" }}>
                      ✂️ {data.services.join(", ")}
                    </p>
                  )}
                  
                  <p style={{ margin: "0", color: "#666", fontSize: "0.85rem", fontWeight: "bold" }}>
                    {data.count} ziyaret
                  </p>

                  <button
                    onClick={() => markAsCalled(customerName)}
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      transition: "all 0.2s",
                      width: "100%",
                      marginTop: "6px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = "#218838";
                      e.target.style.boxShadow = "0 2px 6px rgba(33, 136, 56, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = "#28a745";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    ✅ TAMAM
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}