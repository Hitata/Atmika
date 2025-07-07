import { formatISO, startOfDay } from "date-fns";
import { createHabit } from "../hooks/habitModel";

// bỏ dấu tiếng Việt → lowerCase → bỏ ký tự đặc biệt
const normalize = (s = "") =>
  s.normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "") // xóa dấu
   .toLowerCase()
   .replace(/[!?.;,]/g, "")
   .trim();


export function detectHabitsFromTasks(tasks, existingHabits) {
  const dateMap = new Map(); // key → Set<YYYY‑MM‑DD>

  for (const t of tasks) {
    const raw = t.intent && t.intent.toLowerCase() !== "khác" ? t.intent : t.text;
    const key = normalize(raw);

    // loại bỏ text rỗng, “khac”, <3 ký tự
    if (!key || key === "khac" || key.length < 3) continue;

    const day = formatISO(
      startOfDay(t.time ? new Date(t.time) : new Date(t.createdAt)),
      { representation: "date" }
    );

    if (!dateMap.has(key)) dateMap.set(key, new Set());
    dateMap.get(key).add(day);
  }

  const fresh = [];

  for (const [key, days] of dateMap) {
    if (days.size >= 3) {
      const exists = existingHabits.some(
        (h) => normalize(h.name) === key
      );
      if (!exists) fresh.push(createHabit(key));
    }
  }
  return fresh;
}
