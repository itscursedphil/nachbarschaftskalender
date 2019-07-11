const { DateTime } = require('luxon');

const calEventIsConfirmed = calEvent =>
  calEvent.getFirstPropertyValue('status') === 'CONFIRMED';
const calEventHasNotEnded = calEvent =>
  Date.now() < new Date(calEvent.getFirstPropertyValue('dtend'));

const formatDate = dt =>
  DateTime.fromISO(dt)
    .setLocale('de')
    .toFormat("d. LLLL y, T 'Uhr'");

const indexIsInRange = (i, length) => i < length;

module.exports = {
  calEventIsConfirmed,
  calEventHasNotEnded,
  formatDate,
  indexIsInRange
};
