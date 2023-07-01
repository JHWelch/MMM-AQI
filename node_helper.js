/* Magic Mirror
 * Node Helper: MMM-Chore-Manager
 *
 * By Jordan Welch
 * MIT Licensed.
 */

const fetch = require('node-fetch');
const Log = require('logger');
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
  socketNotificationReceived(notification, payload) {
    if (notification !== 'MMM-AQI-FETCH') {
      return;
    }
    if (!this.validate(payload)) {
      return;
    }

    const { token, city } = payload;

    this.getData(token, city);
  },

  async getData(token, city) {
    const response = await fetch(
      `https://api.waqi.info/feed/${city}/?token=${token}`,
      this.requestInit(),
    );

    const { aqi } = (await response.json()).data;

    this.sendSocketNotification('MMM-AQI-DATA', { aqi });
  },

  requestInit() {
    return {
      headers: { Accept: 'application/json' },
    };
  },

  validate(payload) {
    const required = ['token', 'city'];

    return this.validateRequired(payload, required);
  },

  validateRequired(payload, required) {
    let valid = true;
    required.forEach((req) => {
      if (!payload[req]) {
        Log.error(`MMM-AQI: Missing ${req} in config`);
        valid = false;
      }
    });

    return valid;
  },
});
