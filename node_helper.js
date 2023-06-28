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

    const { token, city } = payload;

    const data = global.fetch(`https://api.waqi.info/feed/${city}/?token=${token}`, { headers: { Accept: 'application/json' } });
  },
});
