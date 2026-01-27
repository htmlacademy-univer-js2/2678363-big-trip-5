import TripPresenter from './presenter/trip-presenter.js';
import TripModel from './model/trip-model.js';
import { DESTINATIONS } from './mock/destinations.js';
import { EVENTS } from './mock/events.js';
import { OFFERS } from './mock/offers.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');

const tripModel = new TripModel(DESTINATIONS, EVENTS, OFFERS);

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  filtersContainer,
  sortContainer,
  tripModel
});

tripPresenter.init();
