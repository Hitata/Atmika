import { useState } from "react";
import { createHabit } from "../hooks/habitModel";
import { getIntent } from "../utils/dateUtils";

export default function HabitInput({ onAdd }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    const clean = text.trim();
    if (!clean) return;

    const intent = getIntent(clean);
    const newHabit = createHabit(clean, intent); // icon theo intent
    onAdd(newHabit);
    setText("");
  };

  return (
    <div className="habit-input">
      <input
        type="text"
        placeholder="Tên thói quen (VD: Uống nước)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="habit-input-field"
      />
      <button onClick={handleAdd} className="habit-input-btn">
        ➕ Thêm habit
      </button>
    </div>
  );
}
