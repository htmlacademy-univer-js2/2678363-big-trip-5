import ApiService from '../framework/api-service.js';
import { METHODS } from '../const.js';
import AdapterService from './adapter-service.js';

export default class PointsApiService extends ApiService {

  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: METHODS.PUT,
      body: JSON.stringify(AdapterService.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: 'points',
      method: METHODS.POST,
      body: JSON.stringify(AdapterService.adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' })
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
}
