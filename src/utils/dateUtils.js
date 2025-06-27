export const parseTime = (text) => {
  const now = new Date();
  const lower = text.toLowerCase();

  // Hàm tiện để đặt giờ, phút = 0
  const setH = (d, h) => {
    d.setHours(h, 0, 0, 0);
    return d;
  };

  // --- Sáng ---
  if (lower.includes("sáng mai")) return setH(new Date(now).setDate(now.getDate() + 1) && new Date(now), 9);
  if (lower.includes("sáng nay")) {
    const d = new Date(now);
    if (now.getHours() >= 11) d.setDate(d.getDate() + 1); // nếu đã quá 11h thì sang hôm sau
    return setH(d, 9);
  }

  // --- Trưa ---
  if (lower.includes("trưa mai")) return setH(new Date(now).setDate(now.getDate() + 1) && new Date(now), 12);
  if (lower.includes("trưa nay")) {
    const d = new Date(now);
    if (now.getHours() >= 13) d.setDate(d.getDate() + 1);
    return setH(d, 12);
  }

  // --- Chiều ---
  if (lower.includes("chiều mai")) return setH(new Date(now).setDate(now.getDate() + 1) && new Date(now), 15);
  if (lower.includes("chiều nay")) return setH(new Date(now), 15);

  // --- Tối/Đêm ---
  if (lower.includes("tối mai") || lower.includes("đêm mai"))
    return setH(new Date(now).setDate(now.getDate() + 1) && new Date(now), 20);
  if (lower.includes("tối nay") || lower.includes("đêm nay")) return setH(new Date(now), 20);

  // Chưa nhận dạng được
  return null;
};

export const getIntent = (text) => {
  const t = text.toLowerCase();
  if (t.includes("mua")) return "🛒 Mua sắm";
  if (t.includes("nhắc") || t.includes("nhớ")) return "⏰ Nhắc nhở";
  if (t.includes("ghi chú") || t.includes("cảm thấy")) return "📝 Ghi chú";
  return "🔖 Khác";
};