import React from "react";

export default function Appointments({ appointments, cancelAppointment, isAdmin }) {
  return (
    <div className="appointments">
      <h2>Randevular</h2>
      {appointments.length === 0 && <p>Henüz randevu yok.</p>}
      <ul>
        {appointments.map((app, idx) => (
          <li key={idx}>
            <span>
              {app.name} {app.surname} - {app.phone} - {app.date} - {app.hour}:00 - {app.kuafor}
            </span>
            {isAdmin && (
              <button onClick={() => cancelAppointment(idx)} style={{marginLeft: "10px"}}>Sil</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}