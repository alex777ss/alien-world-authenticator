const axios = require('axios');
const puppeteer = require('puppeteer');

async function test() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage();
  const response = await request(page, {
    method: 'get',
    url: `https://public-wax-on.wax.io/wam/users`,
    headers: {
      'x-access-token': 'fzXC7igGIOHXVxRROTVgnbcGWu05drUpsNUxroBn'
    }
  })
  console.log(response);
}

async function request(page, options) {
  return await page.evaluate(async () => {
    return axios(options);
  })
}

test();
