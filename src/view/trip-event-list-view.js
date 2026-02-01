import AbstractView from '../framework/view/abstract-view.js';

const createTripEventListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventListView extends AbstractView {
  get template() {
    return createTripEventListTemplate();
  }
}
