/* ---------- Format hiển thị thông minh ---------- */
import { isToday, isYesterday } from "date-fns";

export function formatSmartTime(date) {
  const localTime = new Date(date);          // đảm bảo local
  const timeStr = localTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  if (isToday(localTime))     return `Hôm nay ${timeStr}`;
  if (isYesterday(localTime)) return `Hôm qua ${timeStr}`;

  const dateStr = localTime.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
  return `${dateStr} ${timeStr}`;
}

/* ---------- Hàm làm sạch transcript ---------- */
export function normalizeTranscript(raw) {
  let s = raw.toLowerCase();

  /* map chữ số đơn */
  const digitMap = {
    "không": "0", "một": "1", "hai": "2", "ba": "3", "bốn": "4",
    "năm": "5",  "sáu": "6", "bảy": "7", "tám": "8", "chín": "9",
  };
  Object.entries(digitMap).forEach(([k, v]) => {
    const re = new RegExp(`\\b${k}\\b`, "g");
    s = s.replace(re, v);
  });

  /* cụm đặc biệt */
  s = s
    .replace(/\bhai mươi lăm\b|\bhai mươi nhăm\b/g, "25")
    .replace(/\bnăm nhăm\b/g, "25");

  /* loại dấu phẩy & khoảng trắng thừa */
  return s.replace(/,/g, " ").replace(/\s+/g, " ").trim();
}

/* ---------- Phân tích thời gian từ câu nói ---------- */
export const parseTime = (text) => {
  const cleaned = normalizeTranscript(text);
  const now     = new Date();
  const lower   = cleaned.toLowerCase();

  const clone      = () => new Date(now.getTime());
  const offsetDay  = (base, o) => { const d = new Date(base); d.setDate(d.getDate() + o); return d; };
  const setHourMin = (d, h, m = 0) => { d.setHours(h, m, 0, 0); return d; };

  /* ===== 1. Bắt giờ/phút cụ thể (ưu tiên) ===== */
  const timeRegex = /(?:lúc|vào)?\s*(\d{1,2})\s*(?:giờ|h)\s*(\d{1,2})?/;
  const match     = lower.match(timeRegex);
  let  hh = null, mm = 0;
  if (match) {
    hh = parseInt(match[1], 10);
    if (match[2]) mm = parseInt(match[2], 10);
  }

  /* ===== 2. Xác định ngày cơ sở (hôm nay / mai / hôm qua) ===== */
  let baseDate = clone();
  if (lower.includes("mai"))       baseDate = offsetDay(baseDate, 1);
  if (lower.includes("hôm qua"))   baseDate = offsetDay(baseDate, -1);

  /* ===== 3. Nếu có nói giờ cụ thể → trả luôn ===== */
  if (hh !== null) {
    return setHourMin(baseDate, hh, mm);
  }

  /* ===== 4. Các cụm sáng / trưa / chiều... ===== */
  if (lower.includes("sáng"))   return setHourMin(baseDate, 8);
  if (lower.includes("trưa"))   return setHourMin(baseDate, 12);
  if (lower.includes("chiều"))  return setHourMin(baseDate, 15);
  if (lower.includes("tối") || lower.includes("đêm"))
                                return setHourMin(baseDate, 20);

  /* ----- Regex ngày dd/mm ----- */
  const dateRegex = /ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})(?:\s+năm\s+(\d{4}))?/;
  const dm       = lower.match(dateRegex);
  if (dm) {
    const [, d, m, y] = dm;
    return new Date(
      y ? parseInt(y, 10) : now.getFullYear(),
      parseInt(m, 10) - 1,
      parseInt(d, 10),
      8, 0, 0, 0
    );
  }

  return null; // không parse được
};

/* ---------- Xác định intent ---------- */
export const getIntent = (text) => {
  const t = text.toLowerCase();
  if (t.includes("mua"))                        return "🛒 Mua sắm";
  if (t.includes("nhắc") || t.includes("nhớ"))  return "⏰ Nhắc nhở";
  if (t.includes("ghi chú") || t.includes("cảm thấy"))
                                                return "📝 Ghi chú";
  return "🔖 Khác";
};

/* ---------- Chuyển Date về local ISO string ---------- */
export const toLocalISOString = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
       + `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
};
