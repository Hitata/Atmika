import { useEffect, useRef, useState } from "react";
import { parseTime, getIntent } from "../utils/dateUtils";

export default function TaskInput({ onAdd }) {
  /* --- State --- */
  const [pendingText, setPendingText] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("🎤 Nhấn để nói hoặc nhập task");
  const [confirmed, setConfirmed] = useState(false);
  const recognitionRef = useRef(null);

  /* --- Khởi tạo Web Speech Recognition --- */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setStatus("Trình duyệt không hỗ trợ Web Speech API");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "vi-VN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recognitionRef.current = recog;

    recog.onstart = () => setStatus("🎧 Đang nghe...");
    recog.onerror = (e) => {
      setStatus("Lỗi: " + e.error);
      setListening(false);
    };
    recog.onend = () => setListening(false);
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setPendingText(text);
      setConfirmed(false);
      console.log("📥 Nhận đầu vào:", text);
    };
  }, []);

  /* --- Hành động --- */
  const handleListen = () => {
    if (!recognitionRef.current) return;
    setPendingText("");
    setListening(true);
    recognitionRef.current.start();
  };

  const confirmTask = () => {
    const time = parseTime(pendingText);
    const intent = getIntent(pendingText);
    const newTask = {
      id: Date.now(),
      text: pendingText,
      intent,
      time,
      createdAt: new Date().toISOString(),
    };
    onAdd(newTask);

    // Đọc lại để xác nhận
    const utter = new SpeechSynthesisUtterance(`Đã thêm: ${pendingText}`);
    utter.lang = "vi-VN";
    window.speechSynthesis.speak(utter);

    console.log("✅ Đã thêm task:", newTask);
    setPendingText("");
    setConfirmed(true);
    setStatus("✅ Task đã được lưu");
  };

  /* --- UI --- */
  return (
    <div className="task-input-container">
      <div className="task-input-controls">
        <button
          onClick={handleListen}
          disabled={listening}
          className="task-input-button"
        >
          🎙 {listening ? "Đang nghe..." : "Nói task"}
        </button>
        <input
          type="text"
          placeholder="Hoặc nhập task..."
          value={pendingText}
          onChange={(e) => setPendingText(e.target.value)}
          className="task-input-field"
        />
      </div>

      <p className="task-input-status">{status}</p>

      {pendingText && !confirmed && (
        <div className="task-input-preview">
          <p>
            🗣 <strong>Bạn nói:</strong> {pendingText}
          </p>
          <p>
            🏷 <strong>Tag:</strong> {getIntent(pendingText)}{" "}
            {parseTime(pendingText) && (
              <>
                | 🕒{" "}
                <strong>{parseTime(pendingText).toLocaleString("vi-VN")}</strong>
              </>
            )}
          </p>
          <div className="task-input-preview-actions">
            <button onClick={confirmTask} className="task-input-confirm-btn">
              ✅ Xác nhận
            </button>
            <button
              onClick={() => setPendingText("")}
              className="task-input-cancel-btn"
            >
              ❌ Huỷ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}