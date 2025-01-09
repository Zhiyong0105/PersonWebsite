export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 转换为秒
  const seconds = Math.floor(diff / 1000);
  
  // 1分钟内
  if (seconds < 60) {
    return '刚刚';
  }
  
  // 1小时内
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  
  // 24小时内
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }
  
  // 7天内
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}天前`;
  }
  
  // 超过7天显示具体日期
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // 如果是今年，只显示月日
  if (year === now.getFullYear()) {
    return `${month}-${day}`;
  }
  
  // 不是今年，显示完整日期
  return `${year}-${month}-${day}`;
}; 