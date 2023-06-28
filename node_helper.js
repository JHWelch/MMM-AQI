/* Magic Mirror
 * Node Helper: MMM-Chore-Manager
 *
 * By Jordan Welch
 * MIT Licensed.
 */

// eslint-disable-next-line import/no-unresolved
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

    const data = global.fetch(`https://api.waqi.info/feed/${city}/?token=${token}`, this.requestInit());
  },

  requestInit() {
    return {
      headers: { Accept: 'application/json' },
    };
  },

  validate(payload) {
    let valid = true;
    if (!payload.city) {
      global.Log.error('MMM-AQI: Missing city in config');
      valid = false;
    }
    if (!payload.token) {
      global.Log.error('MMM-AQI: Missing token in config');
      valid = false;
    }

    return valid;
  },
});
