import { OFFERS } from './mock/offers';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

function getDuration(startDate, endDate) {
  const durationMs = endDate - startDate;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
}

function getRandomOffers(eventType) {
  const offersByType = OFFERS.filter((offer) => offer.type === eventType);

  const count = getRandomNumber(0, offersByType.length);

  return [...offersByType]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

export { getRandomArrayElement, getRandomNumber, formatDate, formatTime, formatDateTime, getDuration, getRandomOffers };
