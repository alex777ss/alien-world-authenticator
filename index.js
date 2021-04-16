const express = require('express');
const cors = require('cors');
const app = express();
const { TWO_CAPTCHA_API_KEY } = require('./src/constants');
const TwoCaptcha = require('./src/service/2captcha');
const SessionStore = require('./src/service/session-store');
const LoginService = require('./src/service/login-service');
const TransactService = require("./src/service/transact-service");

const sessionStore = new SessionStore();
const loginService = new LoginService(sessionStore);
const twoCaptcha = new TwoCaptcha(TWO_CAPTCHA_API_KEY);
const transactService = new TransactService(sessionStore, loginService, twoCaptcha);


const puppeteer = require('puppeteer');


app.use(cors());
app.use(express.json());
app.get('/api/login', async (req, res) => {
  const accountName = req.query.accountName;
  if (!accountName) {
    return res.status(401).send({
      message: 'accountName is mandatory'
    })
  }

  try {
    let response = await loginService.login(accountName);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message
    })
  }
})

app.post('/api/transact', async (req, res) => {
  const payload = req.body;
  if (!payload.accountName || !payload.nonce) {
    return res.status(400).send({
      message: 'invalid data: ' + JSON.stringify(payload)
    });
  }
  try {
    const result = await transactService.transact(payload)
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: error.message
    })
  }
})

app.get('/api/open-wallet', async (req, res) => {
  const accountName = req.query.accountName;
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
    await page.setCookie({ name: 'session_token', value: sessionToken, secure: true, httpOnly: true, domain: '.wax.io', path: '/'})
    await page.goto('https://wallet.wax.io');
  } catch (ignore) {
  }

  return res.status(200).send();
})

const PORT = process.env.PORT || 7878
app.listen(PORT, () => {
  console.log(`API Started on http://localhost:${PORT}`);
});
