export default class EventModel {
  constructor({ id, type, destination, startTime, endTime, price, offers, isFavorite }) {
    this.id = id;
    this.type = type;
    this.destination = destination;
    this.startTime = startTime;
    this.endTime = endTime;
    this.price = price;
    this.offers = offers;
    this.isFavorite = isFavorite;
  }
}
