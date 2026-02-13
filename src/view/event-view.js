import { formatDate, formatTime, getDuration } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

function createEventTemplate(eventData) {
  const { type, destination, startTime, endTime, price, offers, isFavorite } = eventData;

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const date = formatDate(startDate);
  const start = formatTime(startDate);
  const end = formatTime(endDate);
  const duration = getDuration(startDate, endDate);

  const offersTemplate = offers && offers.length > 0 ? offers.map((offer) => `
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `).join('') : '';

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate.toISOString()}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="${type} icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate.toISOString()}">${start}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDate.toISOString()}">${end}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        ${offersTemplate ? `
          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${offersTemplate}
          </ul>
        ` : ''}
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class EventView extends AbstractView {
  #event = null;
  #onRollupClick = null;
  #onFavoriteClick = null;

  constructor({ event, onRollupClick, onFavoriteClick }) {
    super();
    this.#event = event;
    this.#onRollupClick = onRollupClick;
    this.#onFavoriteClick = onFavoriteClick;

    const rollupButton = this.element.querySelector('.event__rollup-btn');
    const favoriteButton = this.element.querySelector('.event__favorite-btn');

    rollupButton.addEventListener('click', this.#rollupClickHandler);
    favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
  };
}
