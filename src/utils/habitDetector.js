import { formatISO, startOfDay } from 'date-fns';
import { createHabit } from '../hooks/habitModel';

const normalize = (s) =>
  s
    .toLowerCase()
    .replace(/[!?.;,]/g, "")
    .trim();

export function detectHabitsFromTasks(tasks, existingHabits) {
  const textDateMap = new Map();

  tasks.forEach((t) => {
    // ⚠️ Lấy ngày từ task.time nếu có, nếu không thì dùng createdAt
    const baseDate = t.time ? new Date(t.time) : new Date(t.createdAt);
    const date = formatISO(startOfDay(baseDate), {
      representation: "date",
    });

    const key = t.intent || normalize(t.text);
 // hoặc t.intent nếu bạn gom theo intent

    if (!textDateMap.has(key)) textDateMap.set(key, new Set());
    textDateMap.get(key).add(date);
  });

  const habitCandidates = [];

  for (const [text, dateSet] of textDateMap.entries()) {
    if (dateSet.size >= 3) {
      const already = existingHabits.find(
        (h) => normalize(h.name) === text
      );
      if (!already) {
        habitCandidates.push(createHabit(text));
      }
    }
  }

  return habitCandidates;
}