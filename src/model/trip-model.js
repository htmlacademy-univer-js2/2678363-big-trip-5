import DestinationModel from './destination-model.js';
import EventModel from './event-model.js';
import OfferModel from './offer-model.js';

export default class TripModel {
  constructor(destinations, events, offers) {
    this.destinations = destinations.map((destination) => new DestinationModel(destination));
    this.events = events.map((event) => new EventModel(event));
    this.offers = offers.map((offer) => new OfferModel(offer));
  }
}
