import FiltersView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import { render, replace } from '../framework/render.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #filtersContainer = null;
  #sortContainer = null;
  #tripModel = null;

  #tripEventListComponent = null;
  #tripEventComponents = [];
  #tripEventEditComponents = [];
  #currentFormIndex = null;


  constructor({ tripEventsContainer, filtersContainer, sortContainer, tripModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortContainer = sortContainer;
    this.#tripModel = tripModel;

    this.#tripEventListComponent = new TripEventListView();
    this.#tripEventComponents = [];
    this.#tripEventEditComponents = [];
  }

  init() {
    this.renderFilters();
    this.renderSort();
    this.renderTripEvents();
  }

  renderFilters() {
    render(new FiltersView(), this.#filtersContainer);
  }

  renderSort() {
    render(new SortView(), this.#sortContainer);
  }

  renderTripEvents() {
    render(this.#tripEventListComponent, this.#tripEventsContainer);

    const events = this.#tripModel.events;
    for (let i = 0; i < events.length; i++) {
      const eventData = events[i];

      const tripEventComponent = new TripEventView({
        event: eventData,
        onRollupClick: () => this.#replaceEventToForm(i)
      });
      this.#tripEventComponents.push(tripEventComponent);

      const tripEventEditComponent = new TripEventEditView({
        eventData: eventData,
        destinations: this.#tripModel.destinations,
        offers: this.#tripModel.offers,
        onFormSubmit: () => this.#replaceFormToEvent(i),
        onCloseClick: () => this.#replaceFormToEvent(i)
      });
      this.#tripEventEditComponents.push(tripEventEditComponent);

      render(tripEventComponent, this.#tripEventListComponent.element);
    }
  }

  #onEscapeKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      if (this.#currentFormIndex !== null) {
        this.#replaceFormToEvent(this.#currentFormIndex);
      }
    }
  };

  #replaceEventToForm = (index) => {
    const tripEventComponent = this.#tripEventComponents[index];
    const tripEventEditComponent = this.#tripEventEditComponents[index];

    replace(tripEventEditComponent, tripEventComponent);

    this.#currentFormIndex = index;
    document.addEventListener('keydown', this.#onEscapeKeyDown);
  };

  #replaceFormToEvent = (index) => {
    const tripEventComponent = this.#tripEventComponents[index];
    const tripEventEditComponent = this.#tripEventEditComponents[index];

    replace(tripEventComponent, tripEventEditComponent);

    this.#currentFormIndex = null;
    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  };
}
