import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../const.js';

function createSortTemplate (currentSortType = SORT_TYPES.DAY) {
  return (
    `<form class="trip-events__trip-sort trip-sort" action="#" method="get">
    <div class="trip-sort__item trip-sort__item--day">
      <input 
        id="sort-day" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-day" 
        data-sort-type="day"
        ${currentSortType === SORT_TYPES.DAY ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-day" data-sort-type="day">Day</label>
    </div>

    <div class="trip-sort__item trip-sort__item--event">
      <input 
        id="sort-event" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-event" 
        disabled
      >
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item trip-sort__item--time">
      <input 
        id="sort-time" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-time" 
        data-sort-type="time"
        ${currentSortType === SORT_TYPES.TIME ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-time" data-sort-type="time">Time</label>
    </div>

    <div class="trip-sort__item trip-sort__item--price">
      <input 
        id="sort-price" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-price" 
        data-sort-type="price"
        ${currentSortType === SORT_TYPES.PRICE ? 'checked' : ''}
      >
      <label class="trip-sort__btn" for="sort-price" data-sort-type="price">Price</label>
    </div>

    <div class="trip-sort__item trip-sort__item--offer">
      <input 
        id="sort-offer" 
        class="trip-sort__input visually-hidden" 
        type="radio" 
        name="trip-sort" 
        value="sort-offer" 
        disabled
      >
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
  );
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = SORT_TYPES.DAY;

  constructor({ onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeClickHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeClickHandler = (evt) => {
    const sortType = evt.target.dataset.sortType;
    if (evt.target.tagName === 'LABEL' && sortType) {
      this.#handleSortTypeChange(sortType);
    }
  };
}
