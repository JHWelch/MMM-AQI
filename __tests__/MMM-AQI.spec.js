require('../__mocks__/Module');
require('../__mocks__/globalLogger');

describe('MMM-AQI', () => {
  const name = 'MMM-AQI';

  let MMMAQI;

  beforeEach(() => {
    jest.resetModules();
    require('../MMM-AQI');

    MMMAQI = global.Module.create(name);
    MMMAQI.setData({ name, identifier: `Module_1_${name}` });
  });

  it('requires expected version', () => {
    expect(MMMAQI.requiresVersion).toBe('2.28.0');
  });

  describe('defaults', () => {
    test('updateInterval', () => {
      expect(MMMAQI.defaults.updateInterval).toBe(60000);
    });
  });

  it('inits module in loading state', () => {
    expect(MMMAQI.loading).toBe(true);
  });

  describe('start', () => {
    const originalInterval = setInterval;
    const configObject = {
      token: 'mock_token',
      city: 'chicago',
    };

    beforeEach(() => {
      MMMAQI.setConfig(configObject);
      global.setInterval = jest.fn();
    });

    afterEach(() => {
      global.setInterval = originalInterval;
    });

    test('logs start of module', () => {
      MMMAQI.start();

      expect(global.Log.info).toHaveBeenCalledWith('Starting module: MMM-AQI');
    });

    test('requests data from node_helper with config variables', () => {
      MMMAQI.start();

      expect(MMMAQI.sendSocketNotification)
        .toHaveBeenCalledWith('MMM-AQI-FETCH', configObject);
    });

    test('interval requests data from node_helper', () => {
      MMMAQI.start();
      global.setInterval.mock.calls[0][0]();

      expect(MMMAQI.sendSocketNotification).toHaveBeenCalledTimes(2);
      expect(MMMAQI.sendSocketNotification)
        .toHaveBeenCalledWith('MMM-AQI-FETCH', configObject);
    });

    test('interval set starts with default value', () => {
      MMMAQI.setConfig({ updateInterval: 100000 });
      MMMAQI.start();

      expect(global.setInterval)
        .toHaveBeenCalledWith(expect.any(Function), 100000);
    });
  });

  describe('getTemplate', () => {
    it('returns template path', () => {
      expect(MMMAQI.getTemplate()).toBe('templates/MMM-AQI.njk');
    });
  });

  describe('getTemplateData', () => {
    it('returns information needed by template', () => {
      MMMAQI.data.aqi = 179;

      expect(MMMAQI.getTemplateData()).toEqual({
        aqi: 179,
        loading: MMMAQI.loading,
        levelClass: MMMAQI.getLevelClass(),
      });
    });

    describe('getLevelClass', () => {
      it('returns aqi-label--good when aqi is less than 51', () => {
        MMMAQI.data.aqi = 49;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--good');
      });

      it('returns aqi-label--moderate when aqi is between 51 and 100', () => {
        MMMAQI.data.aqi = 51;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--moderate');
      });

      it('returns aqi-label--sensitive when aqi is between 101 and 150', () => {
        MMMAQI.data.aqi = 101;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--sensitive');
      });

      it('returns aqi-label--unhealthy when aqi is between 151 and 200', () => {
        MMMAQI.data.aqi = 151;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--unhealthy');
      });

      it('returns aqi-label--very-unhealthy when aqi is between 201 and 300', () => {
        MMMAQI.data.aqi = 201;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--very-unhealthy');
      });

      it('returns aqi-label--hazardous when aqi is greater than 300', () => {
        MMMAQI.data.aqi = 301;

        expect(MMMAQI.getTemplateData().levelClass).toBe('aqi-label--hazardous');
      });
    });
  });

  describe('getStyles', () => {
    describe('default', () => {
      it('returns styles path', () => {
        expect(MMMAQI.getStyles()).toEqual([
          'font-awesome.css',
          'MMM-AQI.css',
        ]);
      });
    });

    describe('config has `colorMode` set to dimmed', () => {
      it('returns styles path', () => {
        MMMAQI.setConfig({ colorMode: 'dimmed' });

        expect(MMMAQI.getStyles()).toEqual([
          'font-awesome.css',
          'MMM-AQI-dimmed.css',
        ]);
      });
    });
  });

  describe('socketNotificationReceived', () => {
    const payload = { aqi: 179 };
    describe('notification is MMM-AQI-DATA', () => {
      it('sets AQI', () => {
        MMMAQI.socketNotificationReceived('MMM-AQI-DATA', payload);

        expect(MMMAQI.data.aqi).toBe(payload.aqi);
      });

      it('sets loading to false', () => {
        MMMAQI.socketNotificationReceived('MMM-AQI-DATA', payload);

        expect(MMMAQI.loading).toBe(false);
      });

      it('updates dom', () => {
        MMMAQI.socketNotificationReceived('MMM-AQI-DATA', payload);

        expect(MMMAQI.updateDom).toHaveBeenCalled();
      });
    });

    describe('notification is not MMM-AQI-DATA', () => {
      it('does not set data', () => {
        MMMAQI.socketNotificationReceived('NOT-MMM-AQI-DATA', payload);

        expect(MMMAQI.data.aqi).toEqual(undefined);
      });
    });
  });
});
