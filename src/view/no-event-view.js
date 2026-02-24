import AbstractView from '../framework/view/abstract-view.js';
import { MESSAGES } from '../const.js';

function createNoEventTemplate(filterType) {
  const key = filterType.toUpperCase();
  return (
    `<p class="trip-events__msg">${MESSAGES[key]}</p>`
  );
}

export default class NoEventView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventTemplate(this.#filterType);
  }
}
