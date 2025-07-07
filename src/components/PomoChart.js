import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f97316", "#ef4444", "#6366f1", "#14b8a6"];

export default function PomoChart({ history }) {
  const counts = history.reduce((acc, h) => {
    acc[h.preset] = (acc[h.preset] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (data.length === 0) return <p className="text-center text-gray-500">Chưa có dữ liệu Pomodoro.</p>;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}