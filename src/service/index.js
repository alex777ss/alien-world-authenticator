const { TWO_CAPTCHA_API_KEY, CAP_MONSTER_CAPTCHA_API_KEY } = require('./../constants');
const TwoCaptcha = require('./transaction/2captcha');
const CaptchaSolver = require('./transaction/captcha-solver');
const SessionStore = require('./account/session-store');
const LoginService = require('./account/login-service');
const NonceService = require('./transaction/nonce-service');
const TransactService = require("./transaction/transact-service");

const sessionStore = new SessionStore();
const nonceService = new NonceService();
const loginService = new LoginService(sessionStore);
const twoCaptcha = new TwoCaptcha(TWO_CAPTCHA_API_KEY);
const captchaSolver = new CaptchaSolver(CAP_MONSTER_CAPTCHA_API_KEY);
const transactService = new TransactService(sessionStore, loginService, captchaSolver);

module.exports = {
  sessionStore,
  nonceService,
  loginService,
  twoCaptcha,
  transactService
}
