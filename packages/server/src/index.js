const Koa = require('koa');
const Router = require('koa-router');
const fetch = require('node-fetch');
const ICal = require('ical.js');
require('dotenv').config();

const {
  calEventIsConfirmed,
  calEventHasNotEnded,
  formatDate,
  indexIsInRange
} = require('./utils');

const { PORT = 8080, MAX_EVENTS = 5, ICAL_URI } = process.env;

if (!ICAL_URI) {
  console.error('🚫  ICAL_URI is missing in node env');
  process.exit(1);
}

const app = new Koa();
const router = new Router();

router.get('/', ctx => {
  ctx.body = '👋';
});

router.get('/events', async ctx => {
  try {
    const calRes = await fetch(ICAL_URI);
    const calData = await calRes.text();

    const parsedCalData = ICal.parse(calData);
    const calComp = new ICal.Component(parsedCalData);
    const calEvents = calComp.getAllSubcomponents('vevent');
    const events = calEvents
      .filter(calEventIsConfirmed)
      .filter(calEventHasNotEnded)
      .filter((e, i) => indexIsInRange(i, MAX_EVENTS))
      .map(event => ({
        title: event.getFirstPropertyValue('summary'),
        description: event.getFirstPropertyValue('description'),
        startTime: formatDate(event.getFirstPropertyValue('dtstart')),
        endTime: formatDate(event.getFirstPropertyValue('dtend'))
      }));

    ctx.body = events;
  } catch (err) {
    console.error('Error');
  }
});

app.use(router.routes()).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
