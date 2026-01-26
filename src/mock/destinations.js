import { getRandomNumber } from '../utils.js';
import { DESCRIPTION_TEXT } from '../const.js';

function getRandomDescription(text) {
  const sentences = text.split('.').map((s) => s.trim());
  const count = getRandomNumber(1, 5);
  if (sentences.length <= count) {
    return `${sentences.join('. ')}.`;
  }

  const selected = [];
  const used = new Set();

  while (selected.length < count) {
    const idx = getRandomNumber(0, sentences.length - 1);
    if (!used.has(idx)) {
      used.add(idx);
      selected.push(sentences[idx]);
    }
  }

  return `${selected.join('. ')}.`;
}

const DESTINATIONS = [
  {
    name: 'Amsterdam',
    description: getRandomDescription(DESCRIPTION_TEXT),
    pictures: Array.from({ length: getRandomNumber(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 10)}`
    }))
  },
  {
    name: 'Geneva',
    description: getRandomDescription(DESCRIPTION_TEXT),
    pictures: Array.from({ length: getRandomNumber(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 10)}`
    }))
  },
  {
    name: 'Chamonix',
    description: getRandomDescription(DESCRIPTION_TEXT),
    pictures: Array.from({ length: getRandomNumber(1, 5) }, () => ({
      src: `https://loremflickr.com/248/152?random=${getRandomNumber(1, 10)}`
    }))
  }
];

export { DESTINATIONS };
