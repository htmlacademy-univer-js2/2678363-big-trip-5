import Observable from '../framework/observable.js';
import AdapterService from '../api/adapter-service.js';
import { UPDATE_TYPES } from '../const.js';

export default class TripModel extends Observable {
  #destinations = [];
  #events = [];
  #offers = [];
  #pointsApiService = null;
  #isLoading = true;
  #adapter = new AdapterService();

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  get events() {
    return this.#events;
  }

  get offers() {
    return this.#offers;
  }

  get isLoading() {
    return this.#isLoading;
  }

  async init() {
    this.#isLoading = true;
    this._notify(UPDATE_TYPES.MAJOR, null);

    try {
      const [points, destinations, offers] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.destinations,
        this.#pointsApiService.offers
      ]);

      this.#destinations = destinations.map((destination) => ({
        id: destination.id,
        name: destination.name,
        description: destination.description,
        pictures: destination.pictures || []
      }));

      const allOffers = [];
      offers.forEach((offerGroup) => {
        offerGroup.offers.forEach((offer) => {
          allOffers.push({
            id: offer.id,
            type: offerGroup.type,
            title: offer.title,
            price: offer.price
          });
        });
      });
      this.#offers = allOffers;

      const adaptedPoints = points.map((point) => this.#adapter.adaptToClient(point));

      this.#events = adaptedPoints.map((point) => {
        const destination = this.#destinations
          .find((item) => item.id === point.destination);
        return {
          id: point.id,
          type: point.type,
          destination: destination,
          dateFrom: point.dateFrom,
          dateTo: point.dateTo,
          basePrice: point.basePrice,
          offers: point.offers
            .map((id) => this.#offers.find((item) => item.id === id)),
          isFavorite: point.isFavorite
        };
      });

      this.#isLoading = false;
      this._notify(UPDATE_TYPES.INIT);
    } catch (err) {
      this.#destinations = [];
      this.#offers = [];
      this.#events = [];
      this.#isLoading = false;
      this._notify(UPDATE_TYPES.INIT);
    }
  }

  async updatePoint(updateType, update) {
    const index = this.#events.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const adaptedResponse = this.#adapter.adaptToClient(response);

      const updatedPoint = {
        ...adaptedResponse,
        destination: this.#destinations
          .find((destination) => destination.id === adaptedResponse.destination),
        offers: adaptedResponse.offers
          .map((id) => this.#offers.find((offer) => offer.id === id))
      };

      this.#events = [
        ...this.#events.slice(0, index),
        updatedPoint,
        ...this.#events.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);

      return updatedPoint;
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const adaptedResponse = this.#adapter.adaptToClient(response);

      const newPoint = {
        ...adaptedResponse,
        destination: this.#destinations.find((destination) => destination.id === response.destination) || null,
        offers: adaptedResponse.offers
          .map((id) => this.#offers.find((offer) => offer.id === id))
          .filter((offer) => offer !== undefined)
      };

      this.#events = [newPoint, ...this.#events];
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#events.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1)
      ];

      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t delete point');
    }
  }
}
