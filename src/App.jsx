import React, { useState, useEffect } from "react";
import AppointmentForm from "./components/AppointmentForm";
import AdminPanel from "./pages/AdminPanel";
import { getAllAppointments, addAppointment as fbAddAppointment, deleteAppointment as fbDeleteAppointment } from "./utils/firebase";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [busyHours, setBusyHours] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde Firebase'den randevuları çek
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const fbAppointments = await getAllAppointments();
        setAppointments(fbAppointments);
      } catch (error) {
        console.error("Randevuları yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

  const addAppointment = async (appointment) => {
    try {
      // Firebase'e kaydet
      const result = await fbAddAppointment(appointment);
      if (result.success) {
        // State'e ekle (Firebase id ile)
        setAppointments([...appointments, { id: result.id, ...appointment }]);
      }
    } catch (error) {
      console.error("Randevu ekleme hatası:", error);
      alert("Randevu eklenirken hata oluştu!");
    }
    
    // SMS gönderme (isteğe bağlı - API konfigürasyonu gerekli)
    // sendAppointmentConfirmationSMS(appointment.phone, appointment);
  };

  const cancelAppointment = async (index) => {
    try {
      const appointment = appointments[index];
      if (appointment.id) {
        // Firebase'den sil
        await fbDeleteAppointment(appointment.id);
      }
      // State'ten sil
      setAppointments(appointments.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Randevu silme hatası:", error);
      alert("Randevu silinirken hata oluştu!");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "3434") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
    } else {
      alert("Şifre yanlış!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <div className="container">
      <h1>✂️ Kandemir Hair Studio ✂️</h1>
      {!isAdmin && (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <button 
              onClick={() => setShowAdminLogin(true)} 
              style={{ 
                background: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#2980b9";
                e.target.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#3498db";
                e.target.style.boxShadow = "none";
              }}
            >
              Admin Giriş
            </button>
          </div>
          {showAdminLogin && (
            <form onSubmit={handleAdminLogin} style={{ 
              marginBottom: "1.5rem",
              background: "#455a64",
              padding: "1.5rem",
              borderRadius: "8px",
              display: "flex",
              gap: "0.75rem"
            }}>
              <input
                type="password"
                placeholder="Şifre Gir"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "1px solid #546e7a",
                  borderRadius: "6px",
                  background: "#546e7a",
                  color: "#ecf0f1",
                  fontSize: "1rem",
                  outline: "none"
                }}
                required
              />
              <button 
                type="submit"
                style={{
                  background: "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#229954";
                  e.target.style.boxShadow = "0 4px 12px rgba(39, 174, 96, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#27ae60";
                  e.target.style.boxShadow = "none";
                }}
              >
                Giriş
              </button>
            </form>
          )}
          <AppointmentForm
            addAppointment={addAppointment}
            appointments={appointments}
            busyHours={busyHours}
            setBusyHours={setBusyHours}
            cancelAppointment={cancelAppointment}
            isAdmin={false}
          />
          
          {/* Konum Bilgileri */}
          <div style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "#455a64",
            borderRadius: "8px"
          }}>
            <h3 style={{ color: "#ecf0f1", margin: "0 0 1rem 0", textAlign: "center" }}>📍 Bizi Ziyaret Edin</h3>

            {/* Çalışma Saatleri */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#ecf0f1", fontWeight: "600", margin: "0 0 0.5rem 0" }}>⏰ Çalışma Saatleri:</p>
              <p style={{ color: "#b0bec5", margin: "0.5rem 0", fontSize: "0.9rem" }}>
                Pazartesi - Cumartesi: 09:00 - 22:00<br />
                Pazar: Kapalı
              </p>
            </div>

            {/* Harita Butonları */}
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <p style={{ color: "#ecf0f1", fontWeight: "600", margin: "0 0 1rem 0" }}>
                ↓ Yol Tarifini Aç ↓
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href="https://maps.google.com/?q=41.071297,28.753583"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#3498db",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    border: "none",
                    fontSize: "0.95rem"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#2980b9";
                    e.target.style.boxShadow = "0 4px 12px rgba(52, 152, 219, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#3498db";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  🗺️ Google Maps
                </a>
                
                <a
                  href="https://yandex.com.tr/maps/?pt=28.753583,41.071297&z=15"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    padding: "12px 20px",
                    borderRadius: "6px",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s",
                    border: "none",
                    fontSize: "0.95rem"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#c0392b";
                    e.target.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#e74c3c";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  🗺️ Yandex Maps
                </a>
              </div>
            </div>

            {/* Mesaj */}
            <div style={{
              background: "#546e7a",
              padding: "1rem",
              borderRadius: "6px",
              textAlign: "center",
              borderLeft: "4px solid #3498db"
            }}>
              <p style={{ color: "#ecf0f1", fontWeight: "600", margin: "0" }}>
                ✂️ Buradan bize gelebilirsiniz!
              </p>
              <p style={{ color: "#b0bec5", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
                Randevu almak için üstteki formu kullanın
              </p>
            </div>
          </div>
        </>
      )}
      {isAdmin && (
        <>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            <button 
              onClick={handleLogout} 
              style={{ 
                background: "#e74c3c",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#c0392b";
                e.target.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.3)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#e74c3c";
                e.target.style.boxShadow = "none";
              }}
            >
              ← Ana Sayfaya Dön
            </button>
          </div>
          <AdminPanel
            appointments={appointments}
            cancelAppointment={cancelAppointment}
            busyHours={busyHours}
            setBusyHours={setBusyHours}
          />
        </>
      )}
    </div>
  );
}