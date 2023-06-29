/* eslint-disable global-require */
describe('MMM-AQI', () => {
  beforeAll(() => {
    require('../__mocks__/Module');
    require('../__mocks__/globalLogger');
  });

  const name = 'MMM-AQI';

  let MMMAQI;

  beforeEach(() => {
    jest.resetModules();
    require('../MMM-AQI');

    MMMAQI = global.Module.create(name);
    MMMAQI.setData({ name, identifier: `Module_1_${name}` });
  });

  it('requires expected version', () => {
    expect(MMMAQI.requiresVersion).toBe('2.2.0');
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
