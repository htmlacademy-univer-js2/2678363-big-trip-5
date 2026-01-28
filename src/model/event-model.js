export default class EventModel {
  constructor({ type, destination, startTime, endTime, price, offers }) {
    this.type = type;
    this.destination = destination;
    this.startTime = startTime;
    this.endTime = endTime;
    this.price = price;
    this.offers = offers;
  }
}
