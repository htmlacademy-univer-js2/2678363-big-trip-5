import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './api/points-api-service.js';
import { END_POINT, AUTHORIZATION } from './const.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const tripModel = new TripModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
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
tripModel.init();

const newEventButton = document.querySelector('.trip-main__event-add-btn');
newEventButton.addEventListener('click', () => {
  if (newEventButton.disabled) {
    return;
  }

  newEventButton.disabled = true;
  tripPresenter.createEvent();
});
