import EventEditView from './event-edit-view.js';

const BLANK_EVENT = {
  type: 'flight',
  destination: null,
  startTime: new Date(),
  endTime: new Date(Date.now() + 3600000),
  price: 0,
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

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.close();
      }
    });
  }
}
