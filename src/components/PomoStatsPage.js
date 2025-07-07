import { useMemo } from "react";
import PomoChart from "../components/PomoChart";

export default function PomoStatsPage() {
  const history = useMemo(() => {
    const raw = localStorage.getItem("pomo-history");
    return raw ? JSON.parse(raw) : [];
  }, []);

  const exportCSV = () => {
    if (!history.length) return;
    const csv = ["task,preset,phase,timestamp"].concat(
      history.map((h) => `${h.task},${h.preset},${h.phase},${h.timestamp}`)
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pomodoro_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-card flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-purple-700">📈 Thống kê Pomodoro</h1>

      <button
        onClick={exportCSV}
        className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        ⬇️ Xuất CSV
      </button>

      <PomoChart history={history} />

      <div>
        <h2 className="text-lg font-semibold mb-2">🕰️ Lịch sử gần đây</h2>
        <ul className="space-y-1 max-h-64 overflow-y-auto pr-2">
          {history.slice(0, 50).map((h, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <span className="font-medium text-gray-900">{h.task}</span> – {h.preset} ({h.phase}) | {new Date(h.timestamp).toLocaleString()}
            </li>
          ))}
          {history.length === 0 && <li className="text-gray-500">Chưa có phiên nào.</li>}
        </ul>
      </div>
    </div>
  );
}