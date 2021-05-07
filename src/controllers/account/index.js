const { sessionStore } = require('../../service');
const puppeteer = require('puppeteer');

class AccountController {
  retrieveFiltersFromRequest(req) {
    return {
      accountName: (req.query.accountName || '').trim(),
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
      count: req.query.count ? parseInt(req.query.count) : 0,
    }
  }

  async search(req, res) {
    const response = {}
    const filters = this.retrieveFiltersFromRequest(req);
    response.content = Object.keys(sessionStore.data).filter(name => name.includes(filters.accountName));
    response.itemsFiltered = response.content.length;
    response.itemsTotal = Object.keys(sessionStore.data).length;
    if (filters.offset >= 0 && filters.count > 0) {
      response.content = response.content.slice(filters.offset, filters.count);
    }
    response.itemsPresented = response.content.length;
    response.offset = filters.offset;
    response.count = filters.offset;
    return res.status(200).json(response);
  }

  async openWalletInBrowser(req, res) {
    const accountName = req.params.accountName;
    if (!accountName) {
      return res.status(401).send({
        message: 'accountName is mandatory'
      })
    }
    const sessionToken = sessionStore.retrieve(accountName);
    if (!sessionToken) {
      return res.status(403).send({
        message: 'not authorized'
      })
    }

    try {
      const browser = await puppeteer.launch({ headless: false, defaultViewport: null })
      const page = await browser.newPage();
      await page.setCookie({
        name: 'session_token',
        value: sessionToken,
        secure: true,
        httpOnly: true,
        domain: '.wax.io',
        path: '/'
      })
      await page.goto('https://wallet.wax.io');
    } catch (ignore) {
    }

    return res.status(200).send();
  }
}

module.exports = new AccountController();
