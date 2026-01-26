import { getRandomArrayElement, getRandomNumber } from '../utils.js';
import { EVENT_TYPES, MSEC_IN_HOUR } from '../const.js';
import { DESTINATIONS } from './destinations.js';
import { OFFERS } from './offers.js';

const EVENTS = [
  {
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 2),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3))
  },
  {
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 24),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 26),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3))
  },
  {
    type: getRandomArrayElement(EVENT_TYPES),
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 48),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 50),
    price: getRandomNumber(50, 300),
    offers: OFFERS.slice(0, getRandomNumber(0, 3))
  }
];

export { EVENTS };
