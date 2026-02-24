import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import { DESTINATIONS } from './mock/destinations.js';
import { EVENTS } from './mock/events.js';
import { OFFERS } from './mock/offers.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const tripModel = new TripModel(DESTINATIONS, EVENTS, OFFERS);
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainer,
  filterModel,
  tripModel
});

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  filtersContainer,
  sortContainer,
  tripModel,
  filterModel
});

filterPresenter.init();
tripPresenter.init();

const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', () => {
  if (newEventButton.disabled) {
    return;
  }

  newEventButton.disabled = true;
  tripPresenter.createEvent();
});
