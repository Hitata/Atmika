export default function TaskItem({ task, onDelete }) {
  
return (
    <li className="task-item">
      <button
        onClick={() => onDelete(task.id)}
        className="task-item-delete"
        title="Xóa task"
      >
        ❌
      </button>
      <span className="task-item-text">{task.text}</span>
      <span className="task-item-tag">{task.intent}</span>
      {task.time && (
        <span className="task-item-time">
          🕒 {new Date(task.time).toLocaleString("vi-VN")}
        </span>
      )}
    </li>
  );
}
