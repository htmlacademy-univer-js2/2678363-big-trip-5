import { MODE, UPDATE_TYPES, USER_ACTION } from '../const.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
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

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      onRollupClick: this.#handleRollupClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new EventEditView({
      eventData: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevEventComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT && prevEventComponent.element.parentElement) {
      replace(this.#eventComponent, prevEventComponent);
      remove(prevEventComponent);
      remove(prevEventEditComponent);
    } else if (this.#mode === MODE.EDITING && prevEventEditComponent?.element.parentElement) {
      replace(this.#eventEditComponent, prevEventEditComponent);
      remove(prevEventComponent);
      remove(prevEventEditComponent);
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
    this.#handleDataChange(
      USER_ACTION.UPDATE_EVENT,
      UPDATE_TYPES.PATCH,
      { ...this.#event, isFavorite: !this.#event.isFavorite }
    );
  };

  #handleFormSubmit = (eventData) => {
    this.#handleDataChange(
      USER_ACTION.UPDATE_EVENT,
      UPDATE_TYPES.MINOR,
      eventData);
    this.#replaceFormToEvent();
  };

  #handleDeleteClick = (eventData) => {
    this.#handleDataChange(
      USER_ACTION.DELETE_EVENT,
      UPDATE_TYPES.MAJOR,
      { id: eventData.id }
    );
  };

  #handleCloseClick = () => {
    this.#replaceFormToEvent();
  };
}
