import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";

import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import HabitInput from "./components/HabitInput";
import HabitList from "./components/HabitList.js";
import PomodoroTimer from "./components/PomodoroTimer"; 
import PomoStatsPage from "./components/PomoStatsPage";
import PomoChart from "./components/PomoChart";

import { detectHabitsFromTasks } from "./utils/habitDetector";
import "./App.css";

/* ---------- HEADER giống Facebook ---------- */
function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">🧠 VoiceTodo</div>

        <nav className="nav-tabs">
          <NavLink to="/tasks" className="nav-tab">
            📝 Tasks
          </NavLink>
          <NavLink to="/habits" className="nav-tab">
            🔥 Habits
          </NavLink>
          <NavLink to="/stats" className="nav-tab">
           📈 Stats
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  /* ---------- STATE ---------- */
  const [tasks, setTasks] = useState(() =>
    JSON.parse(localStorage.getItem("voice-tasks") || "[]")
  );
  const [habits, setHabits] = useState(() =>
    JSON.parse(localStorage.getItem("voice-habits") || "[]")
  );
  const [pomoTask, setPomoTask] = useState(null); // 👈 trạng thái Pomodoro

  const navigate = useNavigate();
  
  const deleteHabit = (id) => {
  setHabits((prev) => prev.filter((h) => h.id !== id));
};

  /* ---------- EFFECT: lưu task + auto habit ---------- */
  useEffect(() => {
    localStorage.setItem("voice-tasks", JSON.stringify(tasks));

    const newHabits = detectHabitsFromTasks(tasks, habits);
    if (newHabits.length) {
      const existing = new Set(habits.map((h) => h.name.toLowerCase().trim()));
      const uniques = newHabits.filter(
        (h) => !existing.has(h.name.toLowerCase().trim())
      );
      if (uniques.length) {
        setHabits((prev) => [...uniques, ...prev]);
        navigate("/habits");
      }
    }
  }, [tasks]);

  /* ---------- EFFECT: lưu habit ---------- */
  useEffect(() => {
    localStorage.setItem("voice-habits", JSON.stringify(habits));
  }, [habits]);

  /* ---------- HANDLERS ---------- */
  const addTask = (task) => setTasks((prev) => [task, ...prev]);
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const addHabit = (habit) => setHabits((prev) => [habit, ...prev]);

  const startPomodoro = (task) => {
    setPomoTask(task);
    navigate("/pomodoro");
  };
  const clearPomodoro = () => {
    setPomoTask(null);
  };

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

  /* ---------- SHELL ---------- */
  const Shell = ({ children }) => (
    <div className="container-card">
      {children}
    </div>
  );

  /* ---------- ROUTES ---------- */
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        <Route
          path="/tasks"
          element={
            <Shell>
              <h1 className="title-blue">📋 Todo bằng giọng nói</h1>
              <TaskInput onAdd={addTask} />
              <TaskList
                tasks={tasks}
                onDelete={deleteTask}
                onStartPomo={startPomodoro} // ✅ truyền vào TaskList
              />
            </Shell>
          }
        />

        <Route
          path="/habits"
          element={
            <Shell>
              <h1 className="title-green">🔥 Habit Tracker</h1>
              <HabitInput onAdd={addHabit} />
              <HabitList habits={habits} onToggle={toggleHabitToday} onDelete={deleteHabit} />
            </Shell>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <Shell>
             {pomoTask ? (
            <PomodoroTimer
             task={pomoTask}
             onFinish={clearPomodoro}
             onCancel={clearPomodoro}
            />
            ) : (
            <p>Không có task nào đang chạy Pomodoro.</p>
            )}
            </Shell>
          }
        />
        <Route path="/stats" element={<PomoStatsPage />} />
        <Route
          path="*"
          element={
            <Shell>
              <p>Không tìm thấy trang 😢</p>
            </Shell>
          }
        />
      </Routes>
    </>
  );
}
