import { EVENT_TYPES } from '../const.js';
import { formatDateTime } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

  const offersByType = offers.filter((offer) => offer.type === type);

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
          value="${offer.id}"
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
    <option value="${dest.name}">${dest.name}</option>
  `).join('');

  const hasDestination = destination?.description;

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
                   list="destination-list-1"
                   required>
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
           ${hasDestination ? `
            <section class="event__section event__section--destination">
              <h3 class="event__section-title event__section-title--destination">Destination</h3>
              ${destination.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
              ${destination.pictures?.length ? `
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destination.pictures.map((pic) => `
                      <img class="event__photo" src="${pic.src}" alt="Destination photo">
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </section>
          ` : ''}
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
  #onDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  constructor({
    eventData = DEFAULT_EVENT,
    destinations,
    offers,
    onFormSubmit,
    onCloseClick,
    onDeleteClick,
  }) {
    super();
    this._setState(eventData);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onCloseClick = onCloseClick;
    this.#onDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
    super.removeElement();
  }

  _restoreHandlers() {
    const formElement = this.element.querySelector('.event--edit');
    const closeButton = this.element.querySelector('.event__rollup-btn');
    const deleteButton = this.element.querySelector('.event__reset-btn');
    const eventTypeInput = this.element.querySelector('.event__type-group');
    const destinationInput = this.element.querySelector('.event__input--destination');
    const offerCheckbox = this.element.querySelectorAll('.event__offer-checkbox');
    const priceInput = this.element.querySelector('.event__input--price');

    formElement.addEventListener('submit', this.#formSubmitHandler);
    closeButton.addEventListener('click', this.#closeClickHandler);
    deleteButton.addEventListener('click', this.#deleteClickHandler);
    eventTypeInput.addEventListener('change', this.#eventTypeChangeHandler);
    destinationInput.addEventListener('change', this.#destinationChangeHandler);
    offerCheckbox.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offerChangeHandler);
    });
    priceInput.addEventListener('input', this.#priceInputHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    this.#datepickerStart = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        ...commonConfig,
        defaultDate: this._state.startTime,
        onChange: this.#dateFromChangeHandler,
        maxDate: this._state.endTime,
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        ...commonConfig,
        defaultDate: this._state.endTime,
        onChange: this.#dateToChangeHandler,
        minDate: this._state.startTime,
      }
    );
  }

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      startTime: userDate
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      endTime: userDate
    });
  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit({ ...this._state });
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#onCloseClick();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#onDeleteClick) {
      this.#onDeleteClick(this._state);
    } else if (this.#onCloseClick) {
      this.#onCloseClick();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeClickHandler(evt);
    }
  };

  #eventTypeChangeHandler = (evt) => {
    if (evt.target.classList.contains('event__type-input')) {
      evt.preventDefault();
      const targetType = evt.target.value;
      this.updateElement({
        type: targetType,
        offers: []
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const targetDestination = evt.target.value;
    const newDestination = this.#destinations.find((item) => item.name === targetDestination);
    this.updateElement({
      destination: newDestination || this._state.destination
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = parseInt(evt.target.value, 10);
    const isChecked = evt.target.checked;
    let currentOffers = [...this._state.offers];

    if (isChecked) {
      const offer = this.#offers.find((item) => item.id === offerId);
      currentOffers.push(offer);
    } else {
      currentOffers = currentOffers.filter((item) => item.id !== offerId);
    }

    this.updateElement({
      offers: currentOffers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const priceValue = evt.target.value;
    this._setState({ price: priceValue });
  };

  close() {
    this.#closeClickHandler(new Event('click'));
  }
}
