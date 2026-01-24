import TripPresenter from './presenter/trip-presenter.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  filtersContainer,
  sortContainer
});

tripPresenter.init();
