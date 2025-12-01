import React, { useState } from "react";
import AppointmentForm from "./components/AppointmentForm";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [busyHours, setBusyHours] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const addAppointment = (appointment) => {
    setAppointments([...appointments, appointment]);
    
    // SMS gönderme (isteğe bağlı - API konfigürasyonu gerekli)
    // sendAppointmentConfirmationSMS(appointment.phone, appointment);
  };

  const cancelAppointment = (index) => {
    setAppointments(appointments.filter((_, i) => i !== index));
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
            isAdmin={false}
          />
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