import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import HabitInput from "./components/HabitInput";
import HabitList from "./components/HabitList.js";
import PomodoroTimer from "./components/PomodoroTimer";
import PomoStatsPage from "./components/PomoStatsPage";
import HabitSuggestionDialog from "./components/HabitSuggestionDialog";
import AdminDashboard from "./components/AdminDashboard";
import DashboardHome from "./components/admin/DashboardHome";
import ManageUsers from "./components/admin/ManageUsers";
import AdminSettings from "./components/admin/AdminSettings";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { detectHabitsFromTasks } from "./utils/habitDetector";
import { authService } from "./utils/auth";
import "./App.css";

function Header({ authedUser, onLogout }) {
  const location = useLocation();
  // Don't show the header on the login page
  if (location.pathname === '/login') {
    return null;
  }
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
          {authedUser && (
            <NavLink to="/admin" className="nav-tab">
              👑 Admin
            </NavLink>
          )}
        </nav>
        {authedUser && (
          <button onClick={onLogout} className="logout-button">Logout</button>
        )}
      </div>
    </header>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() =>
    JSON.parse(localStorage.getItem("voice-tasks") || "[]")
  );
  const [habits, setHabits] = useState(() =>
    JSON.parse(localStorage.getItem("voice-habits") || "[]")
  );
  const [pomoTask, setPomoTask] = useState(null);
  const [suggestedHabit, setSuggestedHabit] = useState(null);
  const [declinedHabits, setDeclinedHabits] = useState([]);
  const [authedUser, setAuthedUser] = useState(authService.getCurrentUser());

  const navigate = useNavigate();
  
  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  useEffect(() => {
    localStorage.setItem("voice-tasks", JSON.stringify(tasks));
    if (suggestedHabit) return;
    const newHabits = detectHabitsFromTasks(tasks, habits, declinedHabits);
    if (newHabits.length > 0) {
      const existing = new Set(habits.map((h) => h.name.toLowerCase().trim()));
      const uniques = newHabits.filter(
        (h) => !existing.has(h.name.toLowerCase().trim())
      );
      if (uniques.length > 0) {
        setSuggestedHabit(uniques[0]);
      }
    }
  }, [tasks, habits, declinedHabits, suggestedHabit]);

  useEffect(() => {
    localStorage.setItem("voice-habits", JSON.stringify(habits));
  }, [habits]);

  const addTask = (task) => setTasks((prev) => [task, ...prev]);
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const addHabit = (habit) => setHabits((prev) => [habit, ...prev]);

  const handleAcceptHabit = () => {
    if (suggestedHabit) {
      addHabit(suggestedHabit);
      setSuggestedHabit(null);
      navigate("/habits");
    }
  };

  const handleDeclineHabit = () => {
    if (suggestedHabit) {
      setDeclinedHabits([...declinedHabits, suggestedHabit.name]);
      setSuggestedHabit(null);
    }
  };

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

  const handleLogin = (user) => {
    setAuthedUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setAuthedUser(null);
    navigate('/login');
  };

  const Shell = ({ children }) => (
    <div className="container-card">
      {children}
    </div>
  );

  return (
    <>
      <Header authedUser={authedUser} onLogout={handleLogout} />
      <HabitSuggestionDialog
        habit={suggestedHabit}
        onAccept={handleAcceptHabit}
        onDecline={handleDeclineHabit}
      />

      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
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
                onStartPomo={startPomodoro}
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
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Admin Routes */}
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
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