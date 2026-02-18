import { FILTER_TYPES } from '../const.js';

export default class FilterModel {
  #currentFilterType = FILTER_TYPES.EVERYTHING;

  get filter() {
    return this.#currentFilterType;
  }

  set filter(filter) {
    this.#currentFilterType = filter;
  }
}
