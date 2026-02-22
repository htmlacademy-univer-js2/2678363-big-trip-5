import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filters) {
  return (
    `<div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filters.map((filter) => `
          <div class="trip-filters__filter">
            <input 
              id="filter-${filter.name}" 
              class="trip-filters__filter-input visually-hidden" 
              type="radio" 
              name="trip-filter" 
              value="${filter.name}"
              ${filter.checked ? 'checked' : ''}
            >
            <label class="trip-filters__filter-label" for="filter-${filter.name}">
              ${filter.name}
            </label>
          </div>
        `).join('')}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;

  constructor({ filters, onFilterTypeChange }) {
    super();
    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.querySelectorAll('.trip-filters__filter-input')
      .forEach((input) => {
        input.addEventListener('change', this.#filterTypeChangeHandler);
      });
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
