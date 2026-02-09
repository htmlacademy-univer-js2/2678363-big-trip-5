import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import { SORT_TYPES } from '../const.js';
import TripEventListView from '../view/trip-event-list-view.js';
import { render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;
  #tripModel = null;

  #tripEventListComponent = null;
  #eventPresenters = new Map();
  #currentSortType = SORT_TYPES.DAY;
  #isSorting = false;

  constructor({ tripEventsContainer, filtersContainer, sortContainer, tripModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortContainer = sortContainer;
    this.#tripModel = tripModel;
    this.#tripEventListComponent = new TripEventListView();
  }

  init() {
    this.#renderFilters();
    this.#renderSort();
    this.#renderTripEvents();
  }

  #renderFilters() {
    render(new FiltersView(), this.#filtersContainer);
  }

  #renderSort() {
    render(
      new SortView({
        onSortTypeChange: this.#handleSortTypeChange
      }),
      this.#sortContainer
    );
  }

  #renderTripEvents() {
    const events = this.#getSortedEvents();
    render(this.#tripEventListComponent, this.#tripEventsContainer);

    events.forEach((event) => this.#renderEvent(event));
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
    const events = [...this.#tripModel.events];

    switch (this.#currentSortType) {
      case SORT_TYPES.TIME:
        return events.sort((a, b) => {
          const durationA = a.endTime - a.startTime;
          const durationB = b.endTime - b.startTime;
          return durationB - durationA;
        });

      case SORT_TYPES.PRICE:
        return events.sort((a, b) => b.price - a.price);

      case SORT_TYPES.DAY:
      default:
        return events.sort((a, b) => a.startTime - b.startTime);
    }
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#isSorting = true;

    this.#clearEventList();

    this.#renderTripEvents();

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
