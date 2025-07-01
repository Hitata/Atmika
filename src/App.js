import { useEffect, useState } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import HabitInput from "./components/HabitInput";
import HabitList from "./components/HabitList";
import "./App.css";

import { detectHabitsFromTasks } from "./utils/habitDetector";
import { parseTime, getIntent } from "./utils/dateUtils";

export default function App() {
  /* ---------- STATE ---------- */
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem("voice-tasks");
    return raw ? JSON.parse(raw) : [];
  });

  const [habits, setHabits] = useState(() => {
    const raw = localStorage.getItem("voice-habits");
    return raw ? JSON.parse(raw) : [];
  });

  /* ---------- EFFECT: lưu task + auto habit ---------- */
  useEffect(() => {
  localStorage.setItem("voice-tasks", JSON.stringify(tasks));

  const newHabits = detectHabitsFromTasks(tasks, habits);
  if (newHabits.length > 0) {
    // Lọc ra những habit thật sự chưa có
    const existingNames = new Set(habits.map(h => h.name.toLowerCase().trim()));
    const uniqueNewHabits = newHabits.filter(
      h => !existingNames.has(h.name.toLowerCase().trim())
    );

    if (uniqueNewHabits.length > 0) {
      setHabits((prev) => [...uniqueNewHabits, ...prev]);
    }
  }
}, [tasks]); // 💡 CHỈ phụ thuộc vào tasks thôi


  /* ---------- EFFECT: lưu habit ---------- */
  useEffect(() => {
    localStorage.setItem("voice-habits", JSON.stringify(habits));
  }, [habits]);

  /* ---------- HANDLERS ---------- */
  const addTask = (task) => {
   setTasks((prev) => [task, ...prev]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addHabit = (habit) => setHabits((prev) => [habit, ...prev]);

  const toggleHabitToday = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completions: h.completions.includes(today)
                ? h.completions.filter((d) => d !== today)
                : [...h.completions, today],
            }
          : h
      )
    );
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-700">📋 Todo bằng giọng nói</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={deleteTask} />

      <h1 className="text-2xl font-bold text-green-700 mt-8">🔥 Habit Tracker</h1>
      <HabitInput onAdd={addHabit} />
      <HabitList habits={habits} onToggle={toggleHabitToday} />
    </div>
  );
}  