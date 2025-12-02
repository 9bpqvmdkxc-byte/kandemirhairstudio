import React, { useState } from "react";
import DatePicker from "./DatePicker";

const hours = Array.from({ length: 14 }, (_, i) => 9 + i); // 9-22
const services = ["Saç", "Sakal", "Saç + Sakal", "Çocuk Saçı", "Saç Yıkama", "Fön", "Keratin", "Cilt Bakımı", "Damat Traşı"];
const workers = ["⭐ Ömer Kandemir", "Muhammet Ali Kandemir", "Velat Bukan", "Eyüp Özdoğan"];

export default function AppointmentForm({ addAppointment, appointments, busyHours }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState(null);
  const [kuafor, setKuafor] = useState("⭐ Ömer Kandemir");
  const [service, setService] = useState("Saç");
  const [successMessage, setSuccessMessage] = useState(false);

  const isHourBusy = (h) =>
    appointments.some(
      (a) =>
        a.date === date &&
        a.hour === h &&
        a.kuafor === kuafor
    ) || (busyHours[date]?.[kuafor]?.includes(h));

  const isHourMeşgul = (h) =>
    busyHours[date]?.[kuafor]?.includes(h);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !surname || !phone || !date || hour === null) return;
    addAppointment({ name, surname, phone, date, hour, kuafor, service });
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
    setName("");
    setSurname("");
    setPhone("");
    setDate("");
    setHour(null);
    setKuafor("⭐ Ömer Kandemir");
    setService("Saç");
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
        placeholder="Telefon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
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
          const selected = hour === h;
          let bg = "#4caf50"; // yeşil
          let label = `${h}:00`;
          
          if (busy) {
            bg = "#e74c3c"; // kırmızı - randevu alınmış
            label = `${h}:00 DOLU`;
          } else if (meşgul) {
            bg = "#f1c40f"; // sarı - meşgul saati
            label = `${h}:00 MEŞGUL`;
          } else if (selected) {
            bg = "#f1c40f"; // sarı - seçilmiş
            label = `${h}:00`;
          }
          
          return (
            <button
              key={h}
              type="button"
              style={{
                background: bg,
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                minWidth: "70px",
                cursor: busy ? "not-allowed" : "pointer",
                fontWeight: selected ? "bold" : "normal",
              }}
              disabled={busy}
              onClick={() => setHour(h)}
            >
              {label}
            </button>
          );
        })}
      </div>
      <button type="submit" disabled={hour === null}>Randevu Al</button>
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
          ✅ Randevu oluşturuldu!
        </div>
      )}
    </form>
  );
}