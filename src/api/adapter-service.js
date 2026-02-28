export default class AdapterService {
  static adaptToServer(point) {
    const adaptedPoint = {
      'type': point.type,
      'destination': point.destination.id,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : point.dateFrom,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : point.dateTo,
      'base_price': Number(point.basePrice),
      'offers': point.offers.map((offer) => offer.id) || [],
      'is_favorite': point.isFavorite
    };

    return adaptedPoint;
  }

  static adaptToClient(point) {
    const adaptedPoint = {
      id: point.id,
      type: point.type,
      destination: point.destination,
      basePrice: Number(point['base_price']),
      dateFrom: point['date_from'] ? new Date(point['date_from']) : null,
      dateTo: point['date_to'] ? new Date(point['date_to']) : null,
      offers: point.offers || [],
      isFavorite: point['is_favorite'] || false
    };

    return adaptedPoint;
  }
}
