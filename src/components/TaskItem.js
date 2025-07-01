import { formatSmartTime } from "../utils/dateUtils";

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
          🕒 {formatSmartTime(new Date(task.time))}
        </span>
      )}
    </li>
  );
}
