import { SORT_TYPES, FILTER_TYPES, USER_ACTION, UPDATE_TYPES, TIME_LIMIT } from '../const.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import EventAddView from '../view/event-add-view.js';
import LoadingView from '../view/loading-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import EventPresenter from './event-presenter.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #sortContainer = null;
  #tripModel = null;
  #filterModel = null;

  #tripEventListComponent = null;
  #noEventComponent = null;
  #sortComponent = null;
  #eventPresenters = new Map();
  #currentSortType = SORT_TYPES.DAY;
  #addEventComponent = null;
  #loadingComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TIME_LIMIT.LOWER_LIMIT,
    upperLimit: TIME_LIMIT.UPPER_LIMIT
  });

  constructor({ tripEventsContainer, sortContainer, tripModel, filterModel }) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#sortContainer = sortContainer;
    this.#tripModel = tripModel;
    this.#filterModel = filterModel;
    this.#tripEventListComponent = new EventListView();

    this.#tripModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderSort();
  }

  #handleModelEvent = (updateType, data) => {
    if (this.#addEventComponent) {
      remove(this.#addEventComponent);
      this.#addEventComponent = null;
      this.#unlockNewEventButton();
    }

    switch (updateType) {
      case UPDATE_TYPES.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;

      case UPDATE_TYPES.MINOR:
        this.#clearEventList();
        this.#renderTripEvents();
        break;

      case UPDATE_TYPES.MAJOR:
        this.#currentSortType = SORT_TYPES.DAY;
        this.#updateSortComponent();
        this.#clearEventList();

        if (this.#tripModel.isLoading) {
          this.#renderLoading();
        } else {
          this.#renderTripEvents();
        }
        break;

      case UPDATE_TYPES.INIT:
        if (this.#loadingComponent) {
          remove(this.#loadingComponent);
          this.#loadingComponent = null;
        }

        this.#renderTripEvents();
        break;
    }
  };

  #renderLoading() {
    this.#loadingComponent = new LoadingView();
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #updateSortComponent() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
    this.#renderSort();
  }

  #renderTripEvents() {
    const events = this.#getSortedEvents();
    this.#clearEventList();

    if (events.length === 0) {
      this.#renderNoEvents();
    } else {
      render(this.#tripEventListComponent, this.#tripEventsContainer);
      events.forEach((event) => this.#renderEvent(event));
    }
  }

  #renderNoEvents() {
    this.#noEventComponent = new NoEventView({
      filterType: this.#filterModel.filter
    });
    render(this.#noEventComponent, this.#tripEventsContainer);
  }

  #getFilteredEvents() {
    const events = this.#tripModel.events;
    const currentDate = Date.now();

    switch (this.#filterModel.filter) {
      case FILTER_TYPES.FUTURE:
        return events.filter((event) => event.dateFrom > currentDate);

      case FILTER_TYPES.PRESENT:
        return events.filter((event) => event.dateFrom <= currentDate && event.dateTo >= currentDate);

      case FILTER_TYPES.PAST:
        return events.filter((event) => event.dateTo < currentDate);

      case FILTER_TYPES.EVERYTHING:
      default:
        return events;
    }
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#sortContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#tripEventListComponent.element,
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #getSortedEvents() {
    const filteredEvents = this.#getFilteredEvents();

    switch (this.#currentSortType) {
      case SORT_TYPES.TIME:
        return filteredEvents.sort((a, b) => {
          const durationA = a.dateTo - a.dateFrom;
          const durationB = b.dateTo - b.dateFrom;
          return durationB - durationA;
        });

      case SORT_TYPES.PRICE:
        return filteredEvents.sort((a, b) => b.basePrice - a.basePrice);

      case SORT_TYPES.DAY:
      default:
        return filteredEvents.sort((a, b) => a.dateFrom - b.dateFrom);
    }
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
      this.#noEventComponent = null;
    }

    if (this.#tripEventListComponent) {
      remove(this.#tripEventListComponent);
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleModelEvent(UPDATE_TYPES.MINOR);
  };

  #handleDataChange = (actionType, updateType, data) => {
    this.#uiBlocker.block();

    let promise;

    switch (actionType) {
      case USER_ACTION.UPDATE_EVENT:
        promise = this.#tripModel.updatePoint(updateType, data)
          .then((updatedPoint) => {
            if (updateType === UPDATE_TYPES.PATCH) {
              const eventPresenter = this.#eventPresenters.get(data.id);
              eventPresenter.init(updatedPoint);
            } else if (updateType === UPDATE_TYPES.MINOR) {
              this.#clearEventList();
              this.#renderTripEvents();
            }
          });
        break;

      case USER_ACTION.ADD_EVENT:
        promise = this.#tripModel.addPoint(updateType, data)
          .then(() => {
            this.#clearEventList();
            this.#renderTripEvents();
          });
        break;

      case USER_ACTION.DELETE_EVENT:
        promise = this.#tripModel.deletePoint(updateType, data)
          .then(() => {
            this.#clearEventList();
            this.#renderTripEvents();
          });
        break;
    }

    return promise.finally(() => {
      this.#uiBlocker.unblock();
    });
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #unlockNewEventButton() {
    const newEventButton = document.querySelector('.trip-main__event-add-btn');
    if (newEventButton) {
      newEventButton.disabled = false;
    }
  }

  #prepareEventList() {
    if (this.#tripEventListComponent.element.parentElement) {
      remove(this.#tripEventListComponent);
    }

    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
      this.#noEventComponent = null;
    }

    this.#tripEventListComponent = new EventListView();
    render(this.#tripEventListComponent, this.#tripEventsContainer);
  }

  createEvent() {
    this.#handleModeChange();

    if (this.#addEventComponent) {
      remove(this.#addEventComponent);
      this.#addEventComponent = null;
      this.#unlockNewEventButton();
      return;
    }

    this.#currentSortType = SORT_TYPES.DAY;
    this.#updateSortComponent();
    this.#filterModel.setFilter(FILTER_TYPES.EVERYTHING, UPDATE_TYPES.MAJOR);

    const events = this.#getSortedEvents();

    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    this.#prepareEventList();

    this.#addEventComponent = new EventAddView({
      destinations: this.#tripModel.destinations,
      offers: this.#tripModel.offers,
      onFormSubmit: this.#handleAddFormSubmit,
      onCloseClick: this.#handleAddFormClose
    });

    render(this.#addEventComponent, this.#tripEventListComponent.element, RenderPosition.AFTERBEGIN);

    if (events.length > 0) {
      events.forEach((event) => this.#renderEvent(event));
    }
  }

  #handleAddFormSubmit = async (event) => {
    this.#addEventComponent.setSaving(true);

    try {
      await this.#handleDataChange(USER_ACTION.ADD_EVENT, UPDATE_TYPES.MAJOR, event);
      this.#handleAddFormClose();
    } catch (err) {
      this.#addEventComponent.setSaving(false);
      this.#addEventComponent.shake();
    }
  };

  #handleAddFormClose = () => {
    if (this.#addEventComponent) {
      remove(this.#addEventComponent);
      this.#addEventComponent = null;
    }

    this.#unlockNewEventButton();
    this.#renderTripEvents();
  };
}
