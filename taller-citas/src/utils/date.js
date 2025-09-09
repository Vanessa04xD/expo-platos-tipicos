// src/utils/date.js
export const formatDateTime = (isoString) => {
  try {
    const d = new Date(isoString);
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return isoString;
  }
};

export function combineDateTime(datePart, timePart) {
  const d = new Date(datePart);
  const t = new Date(timePart);
  const combined = new Date(d);
  combined.setHours(t.getHours(), t.getMinutes(), 0, 0);
  return combined;
}
