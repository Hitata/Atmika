import TaskItem from './TaskItem';

export default function TaskList({ tasks, onDelete, onStartPomo }) {
  return (
    <div className="task-list">
      <h2 className="task-list-title">📌 Danh sách task</h2>
      <ul className="task-list-items">
        {tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onDelete={onDelete}
            onStartPomo={onStartPomo} // 👈 thêm dòng này
          />
        ))}
        {tasks.length === 0 && (
          <li className="task-list-empty">Chưa có task nào</li>
        )}
      </ul>
    </div>
  );
}
