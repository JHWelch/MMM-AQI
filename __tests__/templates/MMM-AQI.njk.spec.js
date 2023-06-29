const nunjucks = require('nunjucks');

describe('MMM-AQI.njk', () => {
  it('renders the template', () => {
    nunjucks.configure(['templates']);
    const payload = {
      aqi: 179,
    };
    const template = nunjucks.render('MMM-AQI.njk', payload);

    expect(template).toContain('179');
  });
});
