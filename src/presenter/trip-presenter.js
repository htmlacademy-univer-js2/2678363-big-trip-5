import { SORT_TYPES, FILTER_TYPES } from '../const.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import { render, remove } from '../framework/render.js';
import EventPresenter from './event-presenter.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #sortContainer = null;
  #tripModel = null;
  #filterModel = null;

  #tripEventListComponent = null;
  #noEventComponent = null;
  #sortComponent = null;
  #eventPresenters = new Map();
  #currentSortType = SORT_TYPES.DAY;
  #isSorting = false;

  constructor({ tripEventsContainer, sortContainer, tripModel, filterModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#sortContainer = sortContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#tripEventListComponent = new EventListView();

    this.#tripModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderSort();
    this.#renderTripEvents();
  }

  #handleModelChange = (updateType) => {
    if (updateType === 'filter') {
      this.#currentSortType = SORT_TYPES.DAY;
      if (this.#sortComponent) {
        remove(this.#sortComponent);
        this.#sortComponent = null;
      }
      this.#renderSort();
    }
    this.#clearEventList();
    this.#renderTripEvents();
  };

  #renderTripEvents() {
    const events = this.#getSortedEvents();

    if (events.length === 0) {
      this.#renderNoEvents();
    } else {
      render(this.#tripEventListComponent, this.#tripEventsContainer);
      events.forEach((event) => this.#renderEvent(event));
    }
  }

  #renderNoEvents() {
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterModel.filter
    });
    render(this.#noEventComponent, this.#tripEventsContainer);
  }

  #getFilteredEvents() {
    const events = this.#tripModel.events;
    const currentDate = Date.now();

    switch (this.#filterModel.filter) {
      case FILTER_TYPES.FUTURE:
        return events.filter((event) => event.startTime > currentDate);

      case FILTER_TYPES.PRESENT:
        return events.filter((event) => event.startTime <= currentDate && event.endTime >= currentDate);

      case FILTER_TYPES.PAST:
        return events.filter((event) => event.endTime < currentDate);

      case FILTER_TYPES.EVERYTHING:
      default:
        return events;
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#sortContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#tripEventListComponent.element,
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #getSortedEvents() {
    const filteredEvents = this.#getFilteredEvents();

    switch (this.#currentSortType) {
      case SORT_TYPES.TIME:
        return filteredEvents.sort((a, b) => {
          const durationA = a.endTime - a.startTime;
          const durationB = b.endTime - b.startTime;
          return durationB - durationA;
        });

      case SORT_TYPES.PRICE:
        return filteredEvents.sort((a, b) => b.price - a.price);

      case SORT_TYPES.DAY:
      default:
        return filteredEvents.sort((a, b) => a.startTime - b.startTime);
    }
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
      this.#noEventComponent = null;
    }

    if (this.#tripEventListComponent) {
      remove(this.#tripEventListComponent);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#isSorting = true;

    this.#handleModelChange('sort', { sortType });

    this.#isSorting = false;
  };


  #handleDataChange = (updatedEvent) => {
    this.#tripModel.updateEvent(updatedEvent);

    const eventPresenter = this.#eventPresenters.get(updatedEvent.id);

    if (this.#isSorting) {
      return;
    }

    if (eventPresenter) {
      eventPresenter.init(updatedEvent);
    }
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
