import { getRandomArrayElement, getRandomNumber } from '../utils.js';
import { EVENT_TYPES, MSEC_IN_HOUR } from '../const.js';
import { DESTINATIONS } from './destinations.js';
import { OFFERS } from './offers.js';

const EVENTS = [
  {
    id: 1,
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 1.2),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3)),
    isFavorite: true
  },
  {
    id: 2,
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 12),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 16.5),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3)),
    isFavorite: false
  },
  {
    id: 3,
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 78),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 83),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3)),
    isFavorite: false
  },
  {
    id: 4,
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 58),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 60.32),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3)),
    isFavorite: false
  },
  {
    id: 5,
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 100),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 101.92),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3)),
    isFavorite: false
  }
];

export { EVENTS };
