import EventEditView from './event-edit-view.js';

const BLANK_EVENT = {
  type: 'flight',
  destination: null,
  dateFrom: new Date(),
  dateTo: new Date(Date.now() + 3600000),
  basePrice: 0,
  offers: [],
  isFavorite: false
};

export default class EventAddView extends EventEditView {
  constructor({ destinations, offers, onFormSubmit, onCloseClick }) {
    super({
      eventData: BLANK_EVENT,
      destinations,
      offers,
      onFormSubmit,
      onCloseClick
    });
  }

  _restoreHandlers() {
    super._restoreHandlers();

    const resetButton = this.element.querySelector('.event__reset-btn');
    if (resetButton) {
      resetButton.textContent = 'Cancel';
    }

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  removeElement() {
    document.removeEventListener('keydown', this._escKeyDownHandler);
    super.removeElement();
  }
}
