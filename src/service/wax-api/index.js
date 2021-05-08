const ALL_ACCESS_URL = 'https://all-access.wax.io/';

class WaxApi {
  browser = null;

  constructor(browser) {
    this.browser = browser;
  }

  async request(options) {
    const browser = await this.browser.getBrowser({ headless: false });
    const allAccessPage = await this.getAllAccessPage(browser);
    return await allAccessPage.evaluate(async (options) => {
      return await (await fetch(options.url, options)).json();
    }, options)
  }

  async getAllAccessPage(browser) {
    const firstPage = (await browser.pages())[0];
    if (firstPage.url() !== ALL_ACCESS_URL) {
      await firstPage.goto(ALL_ACCESS_URL)
    }
    return firstPage;
  }
}

module.exports = WaxApi;
