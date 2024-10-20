const { default: fetchMock } = require('fetch-mock');
const mockResponse = require('./fixtures/mockResponse');

/* eslint-disable global-require */
beforeAll(() => {
  require('../__mocks__/logger');
});

describe('node_helper', () => {
  let helper;
  let Log;

  beforeEach(() => {
    helper = require('../node_helper');
    Log = require('logger');

    helper.setName('MMM-AQI');
  });

  describe('socketNotificationReceived', () => {
    describe('passed proper config', () => {
      beforeEach(() => {
        fetchMock.mock('https://api.waqi.info/feed/chicago/?token=mock-token', {
          status: 200,
          body: mockResponse(),
        });
      });

      afterEach(() => {
        fetchMock.restore();
      });

      it('fetches the aqi for the city', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {
          city: 'chicago',
          token: 'mock-token',
        });

        expect(fetchMock.calls()[0][0]).toBe(
          'https://api.waqi.info/feed/chicago/?token=mock-token',
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

        expect(Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing city in config',
        );
      });
    });

    describe('missing token', () => {
      it('outputs an error', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {
          city: 'chicago',
        });

        expect(Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing token in config',
        );
      });
    });

    describe('missing city and token', () => {
      it('outputs both errors', () => {
        helper.socketNotificationReceived('MMM-AQI-FETCH', {});

        expect(Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing city in config',
        );
        expect(Log.error).toHaveBeenCalledWith(
          'MMM-AQI: Missing token in config',
        );
      });
    });
  });
});
