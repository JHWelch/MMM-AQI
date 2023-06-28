/* eslint-disable global-require */
const mockResponse = require('../__mocks__/mockResponse');

beforeAll(() => {
  require('../__mocks__/Logger');
});

describe('node_helper', () => {
  let helper;

  beforeEach(() => {
    helper = require('../node_helper');

    helper.setName('MMM-AQI');
  });

  describe('socketNotificationReceived', () => {
    describe('passed proper config', () => {
      beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve(mockResponse()));
      });

      it('fetches the aqi for the city', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {
          city: 'chicago',
          token: 'mock-token',
        });

        expect(fetch).toHaveBeenCalledWith(
          'https://api.waqi.info/feed/chicago/?token=mock-token',
          { headers: { Accept: 'application/json' } },
        );
      });

      it('sends the data to the client', async () => {
        await helper.socketNotificationReceived('MMM-AQI-FETCH', {
          city: 'chicago',
          token: 'mock-token',
        });

        expect(helper.sendSocketNotification)
          .toHaveBeenCalledWith('MMM-AQI-DATA', {
            aqi: 179,
          });
      });
    });

    describe('missing city', () => {
      it('outputs an error', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {
          token: 'mock-token',
        });

        expect(global.Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing city in config',
        );
      });
    });

    describe('missing token', () => {
      it('outputs an error', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {
          city: 'chicago',
        });

        expect(global.Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing token in config',
        );
      });
    });

    describe('missing city and token', () => {
      it('outputs both errors', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {});

        expect(global.Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing city in config',
        );
        expect(global.Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing token in config',
        );
      });
    });
  });
});
