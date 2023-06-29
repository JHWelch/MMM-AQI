/* Magic Mirror
 * Node Helper: MMM-Chore-Manager
 *
 * By Jordan Welch
 * MIT Licensed.
 */

const Log = require('logger'); // eslint-disable-line import/no-unresolved
const NodeHelper = require('node_helper'); // eslint-disable-line import/no-unresolved

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

    this.sendSocketNotification('MMM-AQI-DATA', {
      aqi,
    });
  },

  requestInit() {
    return {
      headers: { Accept: 'application/json' },
    };
  },

  validate(payload) {
    let valid = true;
    if (!payload.city) {
      Log.error('MMM-AQI: Missing city in config');
      valid = false;
    }
    if (!payload.token) {
      Log.error('MMM-AQI: Missing token in config');
      valid = false;
    }

    return valid;
  },
});
