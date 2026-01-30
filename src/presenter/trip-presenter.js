import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripPresenter {
  constructor({ tripEventsContainer, filtersContainer, sortContainer, tripModel }) {
    this.tripEventsContainer = tripEventsContainer;
    this.filtersContainer = filtersContainer;
    this.sortContainer = sortContainer;
    this.tripModel = tripModel;

    this.tripEventListComponent = new TripEventListView();
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderTripEvents();
  }

  renderFilters() {
    render(new FiltersView(), this.filtersContainer);
  }

  renderSort() {
    render(new SortView(), this.sortContainer);
  }

  renderTripEvents() {
    render(this.tripEventListComponent, this.tripEventsContainer);

    const newEventView = new TripEventEditView(
      null,
      this.tripModel.destinations,
      this.tripModel.offers
    );
    render(newEventView, this.tripEventListComponent.element, RenderPosition.AFTERBEGIN);

    const events = this.tripModel.events;
    for (let i = 1; i < events.length; i++) {
      const eventData = events[i];
      const eventView = new TripEventView(eventData);
      render(eventView, this.tripEventListComponent.element);
    }
  }
}
