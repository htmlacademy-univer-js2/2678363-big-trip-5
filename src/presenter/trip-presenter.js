import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  constructor({ tripEventsContainer, filtersContainer, sortContainer }) {
    this.tripEventsContainer = tripEventsContainer;
    this.filtersContainer = filtersContainer;
    this.sortContainer = sortContainer;

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

    render(new TripEventEditView(), this.tripEventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripEventView(), this.tripEventListComponent.getElement());
    }
  }
}
