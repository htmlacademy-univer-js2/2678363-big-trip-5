import ApiService from '../framework/api-service.js';
import { METHODS } from '../const.js';

export default class PointsApiService extends ApiService {
  getPoints() {
    return this._load({ url: 'points'})
      .then(ApiService.parseResponse);
  }

  getDestinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: METHODS.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: METHODS.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: METHODS.DELETE
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      'type': point.type,
      'destination': point.destination,
      'date_from': point.startTime instanceof Date ? point.startTime.toISOString() : null,
      'date_to': point.endTime instanceof Date ? point.endTime.toISOString() : null,
      'base_price': point.price,
      'offers': point.offers,
      'is_favorite': point.isFavorite
    };

    return adaptedPoint;
  }
}
