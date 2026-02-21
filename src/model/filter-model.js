import { FILTER_TYPES } from '../const.js';
import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #currentFilterType = FILTER_TYPES.EVERYTHING;

  get filter() {
    return this.#currentFilterType;
  }

  setFilter(filterType) {
    this.#currentFilterType = filterType;
    this._notify('filter', filterType);
  }
}
