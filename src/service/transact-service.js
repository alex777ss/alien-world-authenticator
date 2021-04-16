const axios = require('axios');
const { Api, JsonRpc, RpcError } = require('eosjs');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');
const { RPC_ENDPOINT, SIGNING_CAPTCHA_KEY, SIGNING_PAGE_URL } = require('../constants');

class TransactService {
  sessionStore;
  loginService;
  twoCaptchaService;

  accountEosApiMap = {};

  constructor(sessionStore, loginService, twoCaptchaService) {
    this.sessionStore = sessionStore;
    this.loginService = loginService;
    this.twoCaptchaService = twoCaptchaService;
  }

  async transact({accountName, nonce}) {
    console.log(`[${accountName}] Pushing mine results...`);
    const mineData = {miner: accountName, nonce};
    console.log(`[${accountName}]: mineData = `, mineData);

    const actions = [{
      account: 'm.federation',
      name: 'mine',
      authorization: [{actor: accountName, permission: 'active'}],
      data: mineData,
    }];

    let api = this.accountEosApiMap[accountName];
    if (!api) {
      api = await this.createApi(accountName)
    }

    try {
      const result = await api.transact({actions}, {blocksBehind: 3, expireSeconds: 90});
      console.log(`[${accountName}]: result = `, result);
      const amounts = new Map();
      if (result && result.processed) {
        result.processed.action_traces[0].inline_traces.forEach((t) => {
          if (t.act.data.quantity) {
            const mine_amount = t.act.data.quantity;
            console.log(`[${accountName}]: Mined ${mine_amount}`);
            if (amounts.has(t.act.data.to)) {
              let obStr = amounts.get(t.act.data.to);
              obStr = obStr.substring(0, obStr.length - 4);
              let nbStr = t.act.data.quantity;
              nbStr = nbStr.substring(0, nbStr.length - 4);
              let balance = (parseFloat(obStr) + parseFloat(nbStr)).toFixed(4);
              amounts.set(t.act.data.to, balance.toString() + ' TLM');
            } else {
              amounts.set(t.act.data.to, t.act.data.quantity);
            }
          }
        });
      }
      return result;
    } catch(err) {
      console.error(err.message);
      throw err;
    }
  }

  async createApi(accountName) {
    const apiSigner = new ApiSigner(accountName, this.loginService, this.sessionStore, this.twoCaptchaService);

    const rpc = new JsonRpc(RPC_ENDPOINT, { fetch });
    const api = new Api({rpc, signatureProvider: apiSigner, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});
    this.accountEosApiMap[accountName] = api;
    return api;
  }

}

class ApiSigner {
  accountName;

  loginService;
  sessionStore;
  twoCaptchaService;


  constructor(accountName, loginService, sessionStore, twoCaptchaService) {
    this.accountName = accountName;
    this.loginService = loginService;
    this.sessionStore = sessionStore;
    this.twoCaptchaService = twoCaptchaService;
  }

  async getAvailableKeys() {
    const authorizedAccount = await this.loginService.login(this.accountName);
    return authorizedAccount.publicKeys;
  }

  async sign(data) {
    const sessionToken = this.sessionStore.retrieve(this.accountName);
    const captcha = await this.twoCaptchaService.solveCaptcha(SIGNING_CAPTCHA_KEY, SIGNING_PAGE_URL);
    const { data: response } = await axios.post('https://public-wax-on.wax.io/wam/sign', {
      'g-recaptcha-response': captcha,
      serializedTransaction: Object.values(data.serializedTransaction),
      website: 'localhost:8080',
      description: 'jwt is insecure'
    }, { headers: { 'x-access-token': sessionToken }})
    return {
      serializedTransaction: data.serializedTransaction,
      signatures: response.signatures
    }
  }
}

module.exports = TransactService;
