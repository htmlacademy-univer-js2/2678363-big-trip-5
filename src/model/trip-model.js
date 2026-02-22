import DestinationModel from './destination-model.js';
import EventModel from './event-model.js';
import OfferModel from './offer-model.js';
import Observable from '../framework/observable.js';


export default class TripModel extends Observable {
  #destinations = [];
  #events = [];
  #offers = [];

  constructor(destinations, events, offers) {
    super();
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

  updateEvent(updateType, updatedEvent) {
    const index = this.#events.findIndex((event) => event.id === updatedEvent.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#events[index] = new EventModel(updatedEvent);
    this._notify(updateType, updatedEvent);
  }

  addEvent(updateType, event) {
    const newId = Math.max(...this.#events.map((e) => e.id), 0) + 1;
    const newEvent = new EventModel({ ...event, id: newId });

    this.#events.push(newEvent);
    this._notify(updateType, newEvent);
  }

  deleteEvent(updateType, data) {
    const id = typeof data === 'object' ? data.id : data;
    const index = this.#events.findIndex((event) => event.id === id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#events.splice(index, 1);
    this._notify(updateType, id);
  }
}
