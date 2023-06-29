const nunjucks = require('nunjucks');

translate = (str) => str;

describe('MMM-AQI.njk', () => {
  describe('content loaded', () => {
    it('shows the AQI', () => {
      nunjucks.configure(['templates']);

      const payload = {
        loading: false,
        aqi: 179,
      };
      const template = nunjucks.render('MMM-AQI.njk', payload);

      expect(template).toContain('179');
    });
  });

  describe('loading', () => {
    it('shows loading', () => {
      const nunjucksEnvironment = nunjucks.configure(['templates']);
      nunjucksEnvironment.addFilter(
        'translate',
        (str, variables) => nunjucks.runtime.markSafe(translate(str, variables)),
      );
      const payload = {
        loading: true,
      };
      const template = nunjucks.render('MMM-AQI.njk', payload);

      expect(template).toContain('LOADING');
    });
  });
});
