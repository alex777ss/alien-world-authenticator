const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

class StealthBrowser {
  browser = null;

  constructor() {
  }

  async getBrowser(options = {}) {
    if (this.browserAlive()) {
      return this.browser;
    }
    await this.createBrowser(options);
    return this.browser;
  }

  async createBrowser(options = {}) {
    this.browser = await puppeteer.launch(options);
    this.browser.on('disconnected', () => {
      this.browser = false;
    });
  }

  browserAlive() {
    return !!this.browser;
  }
}

module.exports = StealthBrowser;
