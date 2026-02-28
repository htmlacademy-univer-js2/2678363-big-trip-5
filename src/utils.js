import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

function formatDate(date) {
  return dayjs(date).format('MMM D');
}

function formatTime(date) {
  return dayjs(date).format('HH:mm');
}

function formatDateTime(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function getDuration(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffMinutes = end.diff(start, 'minute');

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  }

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
}

export { formatDate, formatTime, formatDateTime, getDuration };
