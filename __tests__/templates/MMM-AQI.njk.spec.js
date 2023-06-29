nunjucks = require('../../__mocks__/nunjucks');

translate = (str) => str;

describe('MMM-AQI.njk', () => {
  describe('content loaded', () => {
    const payload = {
      loading: false,
      aqi: 179,
    };

    it('shows the title', () => {
      const template = nunjucks.render('MMM-AQI.njk', payload);

      expect(template).toContain('AQI');
    });
    it('shows the AQI', () => {
      const template = nunjucks.render('MMM-AQI.njk', payload);

      expect(template).toContain('179');
    });
  });

  describe('loading', () => {
    it('shows loading', () => {
      const payload = { loading: true };
      const template = nunjucks.render('MMM-AQI.njk', payload);

      expect(template).toContain('LOADING');
    });
  });
});
