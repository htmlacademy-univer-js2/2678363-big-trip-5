import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import { replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #destinations = [];
  #offers = [];
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;
  #mode = Mode.DEFAULT;

  constructor({ eventListContainer, event, destinations, offers, onDataChange, onModeChange }) {
    this.#eventListContainer = eventListContainer;
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init() {
    this.#eventComponent = new TripEventView({
      event: this.#event,
      onRollupClick: this.#handleRollupClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#eventEditComponent = new TripEventEditView({
      eventData: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick
    });
    this.#eventListContainer.append(this.#eventComponent.element);
  }

  updateEvent(updatedEvent) {
    this.#event = updatedEvent;

    if (this.#mode === Mode.EDITING) {
      const oldEditComponent = this.#eventEditComponent;

      this.#eventEditComponent = new TripEventEditView({
        eventData: this.#event,
        destinations: this.#destinations,
        offers: this.#offers,
        onFormSubmit: this.#handleFormSubmit,
        onCloseClick: this.#handleCloseClick
      });

      replace(this.#eventEditComponent, oldEditComponent);
    } else {
      const oldEventComponent = this.#eventComponent;

      this.#eventComponent = new TripEventView({
        event: this.#event,
        onRollupClick: this.#handleRollupClick,
        onFavoriteClick: this.#handleFavoriteClick
      });

      replace(this.#eventComponent, oldEventComponent);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToEvent();
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceEventToForm = () => {
    this.#handleModeChange();
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };

  #handleRollupClick = () => {
    this.#replaceEventToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#event, isFavorite: !this.#event.isFavorite });
  };

  #handleFormSubmit = () => {
    this.#replaceFormToEvent();
  };

  #handleCloseClick = () => {
    this.#replaceFormToEvent();
  };
}
