// eslint-disable-next-line import/no-extraneous-dependencies
require('jest-fetch-mock').enableMocks();

afterEach(() => {
  fetchMock.mockClear();
  jest.clearAllMocks();
});
