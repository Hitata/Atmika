import { formatISO, startOfToday } from "date-fns";

export default function HabitList({ habits, onToggle, onDelete }) {
  const today = formatISO(startOfToday(), { representation: "date" });

  return (
    <div className="habit-list">
      <h2 className="habit-list-title">✅ Theo dõi thói quen</h2>

      {habits.length === 0 && <p>Chưa phát hiện thói quen nào</p>}

      <ul className="habit-list-items">
        {habits.map((h) => {
          const isTodayDone = h.completions.includes(today);
          return (
            <li key={h.id} className="habit-item">
              <span className="habit-icon">{h.icon || "🔥"}</span>
              <span className="habit-name">{h.name}</span>

              <button
                onClick={() => onToggle(h.id)}
                className={`habit-toggle-btn ${isTodayDone ? "done" : ""}`}
              >
                {isTodayDone ? "✅ Đã làm" : "📅 Chưa làm"}
              </button>

              <button
                onClick={() => onDelete(h.id)}
                className="habit-delete-btn"
              >
                🗑
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
