import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
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
    render(new SortView(), this.#sortContainer);
  }

  #renderTripEvents() {
    render(this.#tripEventListComponent, this.#tripEventsContainer);

    const events = this.#tripModel.events;
    events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#tripEventListComponent.element,
      event: event,
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init();
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleDataChange = (updatedEvent) => {
    this.#tripModel.updateEvent(updatedEvent);

    const eventPresenter = this.#eventPresenters.get(updatedEvent.id);
    if (eventPresenter) {
      eventPresenter.updateEvent(updatedEvent);
    }
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
