import { useEffect, useState } from 'react';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import "./App.css"
export default function App() {
  const [tasks, setTasks] = useState(() => {
    const raw = localStorage.getItem('voice-tasks');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem('voice-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks((prev) => [task, ...prev]);
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="max-w-xl mx-auto p-6 space-y-5 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold text-blue-700">📋 Todo bằng giọng nói</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
}
