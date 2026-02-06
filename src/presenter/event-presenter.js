import TripEventEditView from '../view/trip-event-edit-view.js';
import TripEventView from '../view/trip-event-view.js';
import { replace } from '../framework/render.js';

export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #destinations = [];
  #offers = [];

  #eventComponent = null;
  #eventEditComponent = null;

  constructor({ eventListContainer, event, destinations, offers }) {
    this.#eventListContainer = eventListContainer;
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    this.#eventComponent = new TripEventView({
      event: this.#event,
      onRollupClick: this.#replaceEventToForm
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

  #replaceEventToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToEvent();
  };

  #handleCloseClick = () => {
    this.#replaceFormToEvent();
  };


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
    }
  };
}
