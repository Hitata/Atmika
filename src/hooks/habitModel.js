import { getIntent } from "../utils/dateUtils";

export const createHabit = (name, intent = null) => {
  const resolvedIntent = intent || getIntent(name);
  return {
    id: Date.now(),
    name,
    icon: resolvedIntent.startsWith("🛒") ? "🛒" :
          resolvedIntent.startsWith("⏰") ? "⏰" :
          resolvedIntent.startsWith("📝") ? "📝" :
          "🔥", // fallback
    completions: [],
  };
};
