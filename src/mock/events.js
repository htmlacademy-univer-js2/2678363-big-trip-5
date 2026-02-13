import { getRandomArrayElement, getRandomNumber, getRandomOffers } from '../utils.js';
import { MSEC_IN_HOUR } from '../const.js';
import { DESTINATIONS } from './destinations.js';

const EVENTS = [
  {
    id: 1,
    type: 'taxi',
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 1.2),
    price: getRandomNumber(50, 300),
    offers: getRandomOffers('taxi'),
    isFavorite: true
  },
  {
    id: 2,
    type: 'bus',
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 12),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 16.5),
    price: getRandomNumber(50, 300),
    offers: getRandomOffers('bus'),
    isFavorite: false
  },
  {
    id: 3,
    type: 'drive',
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 78),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 83),
    price: getRandomNumber(50, 300),
    offers: getRandomOffers('drive'),
    isFavorite: false
  },
  {
    id: 4,
    type: 'flight',
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 58),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 60.32),
    price: getRandomNumber(50, 300),
    offers: getRandomOffers('flight'),
    isFavorite: false
  },
  {
    id: 5,
    type: 'ship',
    destination: getRandomArrayElement(DESTINATIONS),
    startTime: new Date(Date.now() + MSEC_IN_HOUR * 100),
    endTime: new Date(Date.now() + MSEC_IN_HOUR * 101.92),
    price: getRandomNumber(50, 300),
    offers: getRandomOffers('ship'),
    isFavorite: false
  }
];

export { EVENTS };
