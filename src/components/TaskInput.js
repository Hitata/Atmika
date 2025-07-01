import { useEffect, useState } from "react";
import { parseTime, getIntent, toLocalISOString } from "../utils/dateUtils";
import useSpeech from "../hooks/useSpeech";

export default function TaskInput({ onAdd }) {
  const [pendingText, setPendingText] = useState("");
  const [status, setStatus] = useState("🎤 Nhấn để nói hoặc nhập task");
  const [confirmed, setConfirmed] = useState(false);

  const {
    transcript,
    listening,
    error,
    start,
    stop,
    resetTranscript,
  } = useSpeech();

  useEffect(() => {
    if (transcript) {
      setPendingText(transcript);
      setConfirmed(false);
      setStatus("📝 Xác nhận task vừa nói");
      console.log("📥 Nhận đầu vào:", transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (error) {
      setStatus("Lỗi: " + error);
    }
  }, [error]);

  const handleListen = () => {
    resetTranscript(); // reset trước khi bắt đầu nghe
    setPendingText("");
    setStatus("🎧 Đang nghe...");
    start();
  };

  const confirmTask = () => {
    const time = parseTime(pendingText);
    const intent = getIntent(pendingText);
    const newTask = {
    id: Date.now(),
    text: pendingText,
    intent,
    time: time ? toLocalISOString(time) : null,
    createdAt: new Date().toISOString(), // vẫn dùng UTC cho createdAt
    };
    onAdd(newTask);

    const utter = new SpeechSynthesisUtterance(`Đã thêm: ${pendingText}`);
    utter.lang = "vi-VN";
    window.speechSynthesis.speak(utter);

    console.log("✅ Đã thêm task:", newTask);
    setPendingText("");
    resetTranscript();
    setConfirmed(true);
    setStatus("✅ Task đã được lưu");
  };

  return (
    <div className="task-input-container">
      <div className="task-input-controls">
        <button
          onClick={listening ? stop : handleListen}
          className="task-input-button"
        >
          {listening ? "🛑 Dừng" : "🎙 Nói task"}
        </button>

        <input
          type="text"
          placeholder="Hoặc nhập task..."
          value={pendingText}
          onChange={(e) => {
            setPendingText(e.target.value);
            setConfirmed(false);
          }}
          className="task-input-field"
        />
      </div>

      <p className="task-input-status">{status}</p>

      {pendingText && !confirmed && (
        <div className="task-input-preview">
          <p>🗣 <strong>Bạn nói:</strong> {pendingText}</p>
          <p>
            🏷 <strong>Tag:</strong> {getIntent(pendingText)}
            {parseTime(pendingText) && (
              <>
                {" "} | 🕒{" "}
                <strong>{parseTime(pendingText).toLocaleString("vi-VN")}</strong>
              </>
            )}
          </p>
          <div className="task-input-preview-actions">
            <button onClick={confirmTask} className="task-input-confirm-btn">
              ✅ Xác nhận
            </button>
            <button
              onClick={() => {
                setPendingText("");
                resetTranscript();
              }}
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
