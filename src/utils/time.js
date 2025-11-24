const units = [
  { label: '年', ms: 365 * 24 * 60 * 60 * 1000 },
  { label: '月', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: '周', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '天', ms: 24 * 60 * 60 * 1000 },
  { label: '小时', ms: 60 * 60 * 1000 },
  { label: '分钟', ms: 60 * 1000 },
];

export const formatRelativeTime = (dateInput) => {
  const diff = Date.now() - new Date(dateInput).getTime();
  if (diff < 60 * 1000) return '刚刚';
  for (const unit of units) {
    if (diff >= unit.ms) {
      const value = Math.floor(diff / unit.ms);
      return `${value}${unit.label}前`;
    }
  }
  return '刚刚';
};

export const formatDateLabel = (dateInput) =>
  new Date(dateInput).toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
