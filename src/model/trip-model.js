import DestinationModel from './destination-model.js';
import EventModel from './event-model.js';
import OfferModel from './offer-model.js';

export default class TripModel {
  #destinations = [];
  #events = [];
  #offers = [];

  constructor(destinations, events, offers) {
    this.#destinations = destinations.map((destination) => new DestinationModel(destination));
    this.#events = events.map((event) => new EventModel(event));
    this.#offers = offers.map((offer) => new OfferModel(offer));
  }

  get destinations() {
    return this.#destinations;
  }

  set destinations(destinations) {
    this.#destinations = destinations;
  }

  get events() {
    return this.#events;
  }

  set events(events) {
    this.#events = events;
  }

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers;
  }

  updateEvent(updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);

    if (index !== -1) {
      this.#events[index] = {
        ...this.#events[index],
        ...updatedEvent
      };
      return true;
    }

    return false;
  }
}
