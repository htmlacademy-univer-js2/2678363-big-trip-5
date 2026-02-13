import { EVENT_TYPES } from '../const.js';
import { formatDateTime } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const DEFAULT_EVENT = {
  type: 'flight',
  destination: null,
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  price: '',
  offers: [],
  isFavorite: false
};

function createEventEditTemplate(state, destinations, offers) {
  const { type, destination, startTime, endTime, price, offers: selectedOffers } = state;

  const startDateValue = formatDateTime(new Date(startTime));
  const endDateValue = formatDateTime(new Date(endTime));

  const offersByType = offers.filter((offer) =>
    offer.type?.toLowerCase() === type?.toLowerCase()
  );

  const selectedOfferIds = new Set(selectedOffers.map((offer) => offer.id));

  const offersTemplate = offersByType.map((offer, index) => {
    const isSelected = selectedOfferIds.has(offer.id);
    return `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox visually-hidden"
          id="event-offer-${index}"
          type="checkbox"
          name="event-offer"
          data-offer-id="${offer.id}"
          ${isSelected ? 'checked' : ''}
        >
        <label class="event__offer-label" for="event-offer-${index}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
    `;
  }).join('');

  const eventTypesTemplate = EVENT_TYPES.map((eventType) => `
    <div class="event__type-item">
      <input
        id="event-type-${eventType.toLowerCase()}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${eventType.toLowerCase()}"
        ${type === eventType.toLowerCase() ? 'checked' : ''}
      >
      <label class="event__type-label event__type-label--${eventType.toLowerCase()}"
             for="event-type-${eventType.toLowerCase()}">
        ${eventType}
      </label>
    </div>
  `).join('');

  const destinationOptions = destinations.map((dest) => `
    <option value="${dest.name}" ${destination?.name === dest.name ? 'selected' : ''}>
      ${dest.name}
    </option>
  `).join('');

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="${type} icon">
            </label>
            <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input event__input--destination"
                   id="event-destination-1"
                   type="text"
                   name="event-destination"
                   value="${destination?.name || ''}"
                   list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationOptions}
            </datalist>
          </div>

          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input event__input--time"
                   id="event-start-time-1"
                   type="text"
                   name="event-start-time"
                   value="${startDateValue}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input event__input--time"
                   id="event-end-time-1"
                   type="text"
                   name="event-end-time"
                   value="${endDateValue}">
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price"
                   id="event-price-1"
                   type="number"
                   min="1"
                   name="event-price"
                   value="${price}">
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close</span>
          </button>
        </header>

        <section class="event__details">
          ${offersByType.length > 0 ? `
            <section class="event__section event__section--offers">
              <h3 class="event__section-title event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                ${offersTemplate}
              </div>
            </section>
          ` : ''}
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            ${destination?.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
            ${destination?.pictures?.length ? `
              <div class="event__photos-container">
                <div class="event__photos-tape">
                  ${destination.pictures.map((pic) => `
                    <img class="event__photo" src="${pic.src}" alt="Destination photo">
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </section>
        </section>
      </form>
    </li>
  `;
}

export default class EventEditView extends AbstractStatefulView {
  #destinations = [];
  #offers = [];
  #onFormSubmit = null;
  #onCloseClick = null;

  constructor({
    eventData = DEFAULT_EVENT,
    destinations,
    offers,
    onFormSubmit,
    onCloseClick,
  }) {
    super();
    this._setState(EventEditView.parseEventToState(eventData));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinations, this.#offers);
  }

  reset(eventData) {
    this.updateElement(
      EventEditView.parseEventToState(eventData)
    );
  }

  _restoreHandlers() {
    const formElement = this.element.querySelector('.event--edit');
    const closeButton = this.element.querySelector('.event__rollup-btn');
    const eventTypeInput = this.element.querySelectorAll('.event__type-input');
    const destinationInput = this.element.querySelector('.event__input--destination');
    const offerCheckbox = this.element.querySelectorAll('.event__offer-checkbox');

    formElement.addEventListener('submit', this.#formSubmitHandler);
    closeButton.addEventListener('click', this.#closeClickHandler);
    eventTypeInput.forEach((input) => {
      input.addEventListener('change', this.#eventTypeChangeHandler);
    });
    destinationInput.addEventListener('change', this.#destinationChangeHandler);
    offerCheckbox.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offerChangeHandler);
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EventEditView.parseStateToEvent(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const validSelectedOffers = this._state.offers.filter((offer) =>
      offer.type?.toLowerCase() === targetType?.toLowerCase()
    );
    this.updateElement({
      type: targetType,
      offers: validSelectedOffers
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#destinations.find((item) => item.name === targetDestination);
    this.updateElement({
      destination: newDestination
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = parseInt(evt.target.dataset.offerId, 10);
    const isChecked = evt.target.checked;

    const currentOffers = [...this._state.offers];

    if (isChecked) {
      const offerToAdd = this.#offers.find((offer) => offer.id === offerId);
      if (offerToAdd && !currentOffers.some((offer) => offer.id === offerId)) {
        currentOffers.push(offerToAdd);
      }
    } else {
      const offerIndex = currentOffers.findIndex((offer) => offer.id === offerId);
      if (offerIndex !== -1) {
        currentOffers.splice(offerIndex, 1);
      }
    }

    this.updateElement({
      offers: currentOffers
    });
  };

  static parseEventToState(eventData) {
    return { ...eventData };
  }

  static parseStateToEvent(state) {
    return { ...state };
  }
}
