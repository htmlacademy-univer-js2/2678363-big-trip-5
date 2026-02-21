import FilterView from '../view/filter-view.js';
import { FILTER_TYPES } from '../const.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #tripModel = null;
  #filterComponent = null;

  constructor({ filterContainer, filterModel, tripModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#tripModel = tripModel;

    this.#tripModel.addObserver(this.#handleModelChange);
  }

  init() {
    const filters = this.#getFilters();
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #getFilters() {
    return [
      {
        type: FILTER_TYPES.EVERYTHING,
        name: 'everything',
        checked: this.#filterModel.filter === FILTER_TYPES.EVERYTHING
      },
      {
        type: FILTER_TYPES.FUTURE,
        name: 'future',
        checked: this.#filterModel.filter === FILTER_TYPES.FUTURE
      },
      {
        type: FILTER_TYPES.PRESENT,
        name: 'present',
        checked: this.#filterModel.filter === FILTER_TYPES.PRESENT
      },
      {
        type: FILTER_TYPES.PAST,
        name: 'past',
        checked: this.#filterModel.filter === FILTER_TYPES.PAST
      }
    ];
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(filterType);
  };

  #handleModelChange = () => {
    this.init();
  };
}
