import { useEffect, useState } from "react";
import { pomoPresets } from "../utils/pomoPresets";

/**
 * PomodoroTimer – đếm ngược cho focus / rest / long‑break
 * - phase đổi => useEffect khởi động lại interval
 * - FX: voice + chuông
 */
export default function PomodoroTimer({ task, onCancel }) {
  const [preset, setPreset] = useState(pomoPresets[0]);
  const [phase, setPhase] = useState("focus");        // focus | rest | long
  const [secondsLeft, setSecondsLeft] = useState(preset.focus * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  /* ---------- Ticker ---------- */
  useEffect(() => {
    if (!isRunning) return;

    const tick = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          playSound();
          handlePhaseEnd();          // phase & secondsLeft sẽ đổi → effect restart
          return 0;
        }
        if (prev === 60) speak("Chỉ còn 1 phút!");
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [isRunning, phase]);            // 👈 thêm phase để rest/long cũng chạy

  /* ---------- Phase chuyển ---------- */
  const handlePhaseEnd = () => {
    if (phase === "focus") {
      const isLastCycle = (sessionCount + 1) % preset.cycle === 0;
      const next = isLastCycle ? "long" : "rest";
      speak(`Hết phiên tập trung. Bắt đầu nghỉ ${next === "long" ? "dài" : "ngắn"}`);
      setPhase(next);
      setSecondsLeft((next === "long" ? preset.longBreak : preset.shortBreak) * 60);
      setSessionCount((c) => c + 1);
    } else {
      speak("Hết giờ nghỉ. Bắt đầu phiên tập trung tiếp theo.");
      setPhase("focus");
      setSecondsLeft(preset.focus * 60);
    }
  };

  /* ---------- Helpers ---------- */
  const speak = (msg) =>
    window.speechSynthesis?.speak(new SpeechSynthesisUtterance(msg));

  const playSound = () => {
    const audio = new Audio("/sounds/bell.mp3");
    audio.play().catch(() => {});
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ---------- UI ---------- */
  return (
    <div className="pomo-wrapper flex flex-col items-center gap-4">
      <h2 className="pomo-task text-xl font-semibold text-green-700 text-center">
        {phase === "focus" ? "🎯 Tập trung" : phase === "rest" ? "🌤 Nghỉ ngắn" : "🌙 Nghỉ dài"}
        {phase === "focus" && <span>: {task.text}</span>}
      </h2>

      {!isRunning && (
        <div className="w-full">
          <label className="font-medium">Chọn phương pháp:</label>
          <select
            className="pomo-input mt-1 w-full border rounded-xl px-4 py-2"
            value={preset.name}
            onChange={(e) =>
              setPreset(pomoPresets.find((p) => p.name === e.target.value))
            }
          >
            {pomoPresets.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.focus}′ làm / {p.shortBreak}′ nghỉ)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="pomo-time font-mono text-6xl font-bold text-green-600">
        {fmt(secondsLeft)}
      </div>

      <div className="pomo-btns space-x-3">
        {!isRunning ? (
          <button
            onClick={() => {
              speak(`Bắt đầu: ${preset.name}`);
              setPhase("focus");
              setSecondsLeft(preset.focus * 60);
              setIsRunning(true);
            }}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            ▶️ Bắt đầu
          </button>
        ) : (
          <button
            onClick={() => {
              speak("Huỷ Pomodoro");
              setIsRunning(false);
              onCancel();
            }}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
          >
            ❌ Huỷ
          </button>
        )}
      </div>
    </div>
  );
}
