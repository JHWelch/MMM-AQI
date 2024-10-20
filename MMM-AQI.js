/* global Module */

/* Magic Mirror
 * Module: MMM-AQI
 *
 * By Jordan Welch
 * MIT Licensed.
 */

Module.register('MMM-AQI', {
  defaults: {
    colorMode: 'default',
    updateInterval: 60000,
  },

  requiresVersion: '2.2.0',

  loading: true,

  start () {
    Log.info(`Starting module: ${this.name}`);
    const self = this;

    this.getData();

    setInterval(() => {
      self.getData();
    }, this.config.updateInterval);
  },

  getData () {
    this.sendSocketNotification('MMM-AQI-FETCH', {
      token: this.config.token,
      city: this.config.city,
    });
  },

  getTemplate () {
    return 'templates/MMM-AQI.njk';
  },

  getTemplateData () {
    return {
      aqi: this.data.aqi,
      loading: this.loading,
      levelClass: this.getLevelClass(),
    };
  },

  getLevelClass () {
    if (this.data.aqi <= 50) {
      return 'aqi-label--good';
    }
    if (this.data.aqi <= 100) {
      return 'aqi-label--moderate';
    }
    if (this.data.aqi <= 150) {
      return 'aqi-label--sensitive';
    }
    if (this.data.aqi <= 200) {
      return 'aqi-label--unhealthy';
    }
    if (this.data.aqi <= 300) {
      return 'aqi-label--very-unhealthy';
    }

    return 'aqi-label--hazardous';
  },

  getScripts () {
    return [];
  },

  getStyles () {
    const aqiCss = this.config.colorMode === 'dimmed'
      ? 'MMM-AQI-dimmed.css'
      : 'MMM-AQI.css';

    return [
      'font-awesome.css',
      aqiCss,
    ];
  },

  getTranslations () {
    return {
      en: 'translations/en.json',
      es: 'translations/es.json',
    };
  },

  socketNotificationReceived (notification, payload) {
    if (notification !== 'MMM-AQI-DATA') {
      return;
    }

    this.data.aqi = payload.aqi;
    this.loading = false;
    this.updateDom(300);
  },
});
