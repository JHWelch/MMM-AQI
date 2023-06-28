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
  });
});
