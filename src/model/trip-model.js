import Destination from './destination-model.js';
import Event from './event-model.js';
import Offer from './offer-model.js';

export default class TripModel {
  constructor(destinations, events, offers) {
    this.destinations = destinations.map((destination) => new Destination(destination));
    this.events = events.map((event) => new Event(event));
    this.offers = offers.map((offer) => new Offer(offer));
  }
}
