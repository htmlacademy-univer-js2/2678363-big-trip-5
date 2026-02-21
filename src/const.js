const EVENT_TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const DESCRIPTION_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const MSEC_IN_HOUR = 3600000;

const SORT_TYPES = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const MESSAGES = {
  'EVERYTHING': 'Click New Event to create your first point',
  'PAST': 'There are no past events now',
  'PRESENT': 'There are no present events now',
  'FUTURE': 'There are no future events now'
};

export { EVENT_TYPES, DESCRIPTION_TEXT, MSEC_IN_HOUR, SORT_TYPES, MODE, FILTER_TYPES, MESSAGES };
