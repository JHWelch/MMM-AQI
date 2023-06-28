function mockResponse() {
  return JSON.stringify({
    status: 'ok',
    data: {
      aqi: 179,
      idx: 7397,
      attributions: [
        {
          url: 'http://www.epa.illinois.gov/',
          name: 'Illinois Environmental Protection Agency',
          logo: 'US-Illinois.png',
        },
        {
          url: 'http://www.airnow.gov/',
          name: 'Air Now - US EPA',
        },
        {
          url: 'https://waqi.info/',
          name: 'World Air Quality Index Project',
        },
      ],
      city: {
        geo: [
          41.9136,
          -87.7239,
        ],
        name: 'Chi_sp, Illinois, USA',
        url: 'https://aqicn.org/city/usa/illinois/chi_sp',
        location: '',
      },
      dominentpol: 'pm25',
      iaqi: {
        h: {
          v: 60.6,
        },
        p: {
          v: 1015.5,
        },
        pm25: {
          v: 179,
        },
        t: {
          v: 18.5,
        },
        w: {
          v: 3.6,
        },
        wg: {
          v: 5.6,
        },
      },
      time: {
        s: '2023-06-27 19:00:00',
        tz: '-06:00',
        v: 1687892400,
        iso: '2023-06-27T19:00:00-06:00',
      },
      forecast: {
        daily: {
          o3: [
            {
              avg: 11,
              day: '2023-06-25',
              max: 12,
              min: 11,
            },
            {
              avg: 12,
              day: '2023-06-26',
              max: 14,
              min: 9,
            },
            {
              avg: 14,
              day: '2023-06-27',
              max: 29,
              min: 7,
            },
            {
              avg: 11,
              day: '2023-06-28',
              max: 29,
              min: 3,
            },
            {
              avg: 16,
              day: '2023-06-29',
              max: 27,
              min: 7,
            },
            {
              avg: 14,
              day: '2023-06-30',
              max: 32,
              min: 3,
            },
            {
              avg: 7,
              day: '2023-07-01',
              max: 18,
              min: 1,
            },
            {
              avg: 12,
              day: '2023-07-02',
              max: 26,
              min: 6,
            },
          ],
          pm10: [
            {
              avg: 3,
              day: '2023-06-25',
              max: 3,
              min: 2,
            },
            {
              avg: 6,
              day: '2023-06-26',
              max: 11,
              min: 2,
            },
            {
              avg: 9,
              day: '2023-06-27',
              max: 31,
              min: 7,
            },
            {
              avg: 10,
              day: '2023-06-28',
              max: 14,
              min: 8,
            },
            {
              avg: 21,
              day: '2023-06-29',
              max: 26,
              min: 9,
            },
            {
              avg: 31,
              day: '2023-06-30',
              max: 46,
              min: 17,
            },
            {
              avg: 12,
              day: '2023-07-01',
              max: 20,
              min: 7,
            },
            {
              avg: 13,
              day: '2023-07-02',
              max: 26,
              min: 7,
            },
          ],
          pm25: [
            {
              avg: 7,
              day: '2023-06-25',
              max: 8,
              min: 6,
            },
            {
              avg: 21,
              day: '2023-06-26',
              max: 42,
              min: 7,
            },
            {
              avg: 34,
              day: '2023-06-27',
              max: 93,
              min: 20,
            },
            {
              avg: 32,
              day: '2023-06-28',
              max: 52,
              min: 23,
            },
            {
              avg: 66,
              day: '2023-06-29',
              max: 78,
              min: 28,
            },
            {
              avg: 90,
              day: '2023-06-30',
              max: 127,
              min: 60,
            },
            {
              avg: 42,
              day: '2023-07-01',
              max: 62,
              min: 26,
            },
            {
              avg: 44,
              day: '2023-07-02',
              max: 82,
              min: 25,
            },
          ],
        },
      },
      debug: {
        sync: '2023-06-28T10:22:27+09:00',
      },
    },
  });
}

describe('node_helper', () => {
  let helper;

  beforeEach(() => {
    // eslint-disable-next-line global-require
    helper = require('../node_helper');

    helper.setName('MMM-AQI');

    global.fetch = jest.fn(() => Promise.resolve(mockResponse()));
  });

  test('', () => {
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
