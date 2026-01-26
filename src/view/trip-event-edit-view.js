import { createElement } from '../render.js';
import { EVENT_TYPES } from '../const.js';
import { formatDateTime } from '../utils.js';

function createTripEventEditTemplate(eventData = null, destinations = [], offers = []) {
  const fallbackDestination = destinations.length > 0
    ? destinations[0]
    : { name: 'Amsterdam', description: '', pictures: [] };

  const defaultOffers = offers.filter((offer) =>
    offer.title === 'Add luggage' || offer.title === 'Switch to comfort class'
  );

  const defaultEvent = {
    type: 'flight',
    destination: fallbackDestination,
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000),
    price: '',
    offers: defaultOffers
  };

  const event = eventData || defaultEvent;
  const { type, destination, startTime, endTime, price, offers: selectedOffers } = event;

  const dateValue = formatDateTime(new Date(startTime));
  const endDateValue = formatDateTime(new Date(endTime));

  const offersTemplate = offers.map((offer, index) => {
    const isSelected = selectedOffers.some((selected) => selected.title === offer.title);
    return `
      <div class="event__offer-selector">
        <input 
          class="event__offer-checkbox visually-hidden" 
          id="event-offer-${index}" 
          type="checkbox" 
          name="event-offer" 
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
    <option value="${dest.name}" ${destination.name === dest.name ? 'selected' : ''}>
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
                   value="${destination.name}" 
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
                   value="${dateValue}">
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
          <section class="event__section event__section--offers">
            <h3 class="event__section-title event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>
          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            ${destination.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
            ${destination.pictures && destination.pictures.length > 0 ? `
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

export default class TripEventEditView {
  constructor(eventData = null, destinations = [], offers = []) {
    this.eventData = eventData;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createTripEventEditTemplate(this.eventData, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
