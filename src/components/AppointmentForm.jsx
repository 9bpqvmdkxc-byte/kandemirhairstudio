import React, { useState } from "react";
import DatePicker from "./DatePicker";

// 9:00 - 22:30 arası saatler (buçuklu)
const hours = [];
for (let h = 9; h < 23; h++) {
  hours.push({ hour: h, minute: 0, display: `${h}:00` });
  if (h < 22) {
    hours.push({ hour: h, minute: 30, display: `${h}:30` });
  }
}
const services = ["Saç", "Sakal", "Saç + Sakal", "Çocuk Saçı", "Saç Yıkama", "Fön", "Keratin", "Cilt Bakımı", "Damat Traşı"];
const workers = ["⭐ Ömer Kandemir", "Muhammet Ali Kandemir", "Velat Bukan", "Eyüp Özdoğan"];

export default function AppointmentForm({ addAppointment, appointments, busyHours, cancelAppointment }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(null);
  const [kuafor, setKuafor] = useState("⭐ Ömer Kandemir");
  const [service, setService] = useState("Saç");
  const [successMessage, setSuccessMessage] = useState(false);
  const [successName, setSuccessName] = useState("");

  const isHourBusy = (h) => {
    const hourStr = `${h.hour}:${String(h.minute).padStart(2, '0')}`;
    return appointments.some(
      (a) =>
        a.date === date &&
        a.hour === h.hour &&
        a.minute === h.minute &&
        a.kuafor === kuafor
    ) || (busyHours[date]?.[kuafor]?.includes(hourStr));
  };

  const isHourMeşgul = (h) => {
    const hourStr = `${h.hour}:${String(h.minute).padStart(2, '0')}`;
    return busyHours[date]?.[kuafor]?.includes(hourStr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Telefon numarası validasyonu - 0 ile başlamalı ve 11 hane olmalı
    if (!phone.startsWith('0')) {
      alert('❌ Telefon numarası 0 ile başlamalıdır!');
      return;
    }
    
    if (phone.length !== 11) {
      alert('❌ Telefon numarası 11 hane olmalıdır!');
      return;
    }
    
    if (!name || !surname || !phone || !date || hour === null) return;
    
    const newAppointment = { 
      name, 
      surname, 
      phone, 
      date, 
      hour: hour.hour,
      minute: hour.minute,
      kuafor, 
      service 
    };
    addAppointment(newAppointment); // Firebase'e gönder (async)
    setSuccessName(`${name[0]}.${surname[0]}`);
    setSuccessMessage(true);
    
    // 3 saniye sonra formu temizle
    setTimeout(() => {
      setSuccessMessage(false);
      setName("");
      setSurname("");
      setPhone("");
      setDate("");
      setHour(null);
      setKuafor("⭐ Ömer Kandemir");
      setService("Saç");
    }, 3000);
  };

  return (
    <form className="appointment-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ad"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Soyad"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Telefon (11 hane)"
        value={phone}
        onChange={(e) => {
          // Sadece rakamları al
          const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
          // Maksimum 11 hane
          if (onlyNumbers.length <= 11) {
            setPhone(onlyNumbers);
          }
        }}
        maxLength="11"
        required
      />
      <DatePicker value={date} onChange={setDate} />
      <select value={kuafor} onChange={(e) => setKuafor(e.target.value)}>
        {workers.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select value={service} onChange={(e) => setService(e.target.value)}>
        {services.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "10px 0" }}>
        {hours.map((h) => {
          const busy = isHourBusy(h);
          const meşgul = isHourMeşgul(h);
          const selected = hour?.hour === h.hour && hour?.minute === h.minute;
          
          // Randevu yapan kişinin baş harflerini bul
          const appointment = appointments.find(
            (a) => a.date === date && a.hour === h.hour && a.minute === h.minute && a.kuafor === kuafor
          );
          const initials = appointment ? `${appointment.name[0]}.${appointment.surname[0]}` : "";
          
          let bg = "#4caf50"; // yeşil
          let label = h.display;
          
          if (busy) {
            bg = "#e74c3c"; // kırmızı - randevu alınmış
            label = `${h.display} ${initials}`;
          } else if (meşgul) {
            bg = "#f1c40f"; // sarı - meşgul saati
            label = `${h.display} MEŞGUL`;
          } else if (selected) {
            bg = "#f1c40f"; // sarı - seçilmiş
            label = h.display;
          }
          
          const handleHourClick = () => {
            // Tarih seçilmemişse uyar
            if (!date) {
              alert("Lütfen önce bir tarih seçin!");
              return;
            }
            
            // Eğer randevu varsa ve müşteri kendi randevusu ise iptal edebilsin
            if (appointment && name && surname && 
                appointment.name === name && appointment.surname === surname) {
              const appointmentIndex = appointments.findIndex(
                (a) => a.date === date && a.hour === h.hour && a.minute === h.minute && a.kuafor === kuafor
              );
              if (appointmentIndex !== -1) {
                cancelAppointment(appointmentIndex);
                setHour(null);
              }
            } else if (!busy) {
              setHour(h);
            }
          };

          return (
            <button
              key={`${h.hour}-${h.minute}`}
              type="button"
              style={{
                background: bg,
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                minWidth: "70px",
                cursor: busy && appointment && name && surname && appointment.name === name && appointment.surname === surname ? "pointer" : busy ? "not-allowed" : "pointer",
                fontWeight: selected ? "bold" : "normal",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                lineHeight: "1.2"
              }}
              disabled={busy && !(appointment && name && surname && appointment.name === name && appointment.surname === surname)}
              onClick={handleHourClick}
              title={appointment && name && surname && appointment.name === name && appointment.surname === surname ? "Randevuyu iptal etmek için tıkla" : ""}
            >
              <div>{h.display}</div>
              {initials && <div style={{ fontSize: "10px", marginTop: "2px" }}>{initials}</div>}
            </button>
          );
        })}
      </div>
      <button type="submit" disabled={!name || !surname || !phone || !date || hour === null}>Randevu Al</button>
      {successMessage && (
        <div style={{
          background: "#27ae60",
          color: "#fff",
          padding: "12px",
          borderRadius: "6px",
          marginTop: "12px",
          textAlign: "center",
          fontWeight: "bold",
          animation: "fadeInOut 3s"
        }}>
          ✅ Randevu oluşturuldu! - {successName}
        </div>
      )}
    </form>
  );
}