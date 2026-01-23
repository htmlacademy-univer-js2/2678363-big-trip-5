import { createElement } from '../render.js';

const createTripEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventListView {
  getTemplate() {
    return createTripEventListTemplate();
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
