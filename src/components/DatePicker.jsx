import React, { useState, useMemo } from "react";

export default function DatePicker({ value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [displayMonth, setDisplayMonth] = useState(new Date(today));

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = useMemo(() => {
    const totalDays = daysInMonth(displayMonth);
    const firstDay = firstDayOfMonth(displayMonth);
    const result = [];

    // Boş günler
    for (let i = 0; i < firstDay; i++) {
      result.push(null);
    }

    // Ayın günleri
    for (let i = 1; i <= totalDays; i++) {
      result.push(i);
    }

    return result;
  }, [displayMonth]);

  const formatDate = (day) => {
    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    return date.toISOString().split("T")[0];
  };

  const isToday = (day) => {
    if (!day) return false;
    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day) => {
    if (!day) return false;
    return formatDate(day) === value;
  };

  const isBeforeToday = (day) => {
    if (!day) return false;
    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    return date < today;
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1));
  };

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  return (
    <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px", marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <button
          type="button"
          onClick={handlePrevMonth}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#222"
          }}
        >
          ◀
        </button>
        <h3 style={{ margin: 0, color: "#222", fontSize: "1rem" }}>
          {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={handleNextMonth}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#222"
          }}
        >
          ▶
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "12px" }}>
        {dayNames.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#888",
              fontSize: "0.8rem",
              padding: "4px"
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {days.map((day, idx) => {
          if (!day) {
            return <div key={`empty-${idx}`}></div>;
          }

          const dateStr = formatDate(day);
          const selected = isSelected(day);
          const isCurrentDay = isToday(day);
          const disabled = isBeforeToday(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => !disabled && onChange(dateStr)}
              disabled={disabled}
              style={{
                aspectRatio: "1",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: selected || isCurrentDay ? "bold" : "normal",
                fontSize: "0.95rem",
                background: selected ? "#222" : isCurrentDay ? "#e3f2fd" : disabled ? "#f0f0f0" : "#fff",
                color: selected ? "#fff" : disabled ? "#ccc" : "#222",
                transition: "all 0.2s"
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {value && (
        <div style={{ marginTop: "12px", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
          Seçilen Tarih: <strong>{value}</strong>
        </div>
      )}
    </div>
  );
}
