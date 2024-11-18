const fetchMock = require('@fetch-mock/jest').default;
const { manageFetchMockGlobally } = require('@fetch-mock/jest');
const mockResponse = require('./fixtures/mockResponse');
require('../__mocks__/logger');

let helper;
let Log;

beforeEach(() => {
  manageFetchMockGlobally(jest);
  helper = require('../node_helper');
  Log = require('logger');

  helper.setName('MMM-AQI');
});

describe('socketNotificationReceived', () => {
  describe('passed proper config', () => {
    beforeEach(() => {
      fetchMock.mockGlobal().get('https://api.waqi.info/feed/chicago/?token=mock-token', {
        status: 200,
        body: mockResponse(),
      });
    });

    afterEach(() => {
      fetchMock.mockReset();
    });

    it('fetches the aqi for the city', async () => {
      await helper.socketNotificationReceived('MMM-AQI-FETCH', {
        city: 'chicago',
        token: 'mock-token',
      });

      expect(fetchMock.callHistory.callLogs[0].args[0]).toBe(
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
