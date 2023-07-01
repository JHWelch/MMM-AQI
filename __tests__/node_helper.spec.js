/* eslint-disable global-require */
beforeAll(() => {
  require('../__mocks__/logger');
  require('../__mocks__/node-fetch');
});

describe('node_helper', () => {
  let helper;
  let Log;
  let fetch;

  beforeEach(() => {
    helper = require('../node_helper');
    Log = require('logger'); // eslint-disable-line import/no-unresolved
    fetch = require('node-fetch'); // eslint-disable-line import/no-unresolved

    helper.setName('MMM-AQI');
  });

  describe('socketNotificationReceived', () => {
    describe('passed proper config', () => {
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

        // expect(helper.sendSocketNotification)
        //   .toHaveBeenCalledWith('MMM-AQI-DATA', {
        //     aqi: 179,
        //   });
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
