import { MODE } from '../const.js';
import TripEventEditView from '../view/event-edit-view.js';
import TripEventView from '../view/event-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #destinations = [];
  #offers = [];
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;
  #mode = MODE.DEFAULT;

  constructor({ eventListContainer, destinations, offers, onDataChange, onModeChange }) {
    this.#eventListContainer = eventListContainer;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event) {
    this.#event = event;

    const prevComponent = this.#eventComponent;

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

    if (prevComponent) {
      replace(this.#eventComponent, prevComponent);
      remove(prevComponent);
    } else {
      render(this.#eventComponent, this.#eventListContainer);
    }
  }

  resetView() {
    if (this.#mode !== MODE.DEFAULT) {
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
    this.#mode = MODE.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;
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
