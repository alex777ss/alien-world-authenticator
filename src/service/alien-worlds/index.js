const {
  setPlayerData,
  setTagData,
  getPlayerData,
  setLand,
  getLand,
  getLandById,
  getPlanets,
  setBag,
  getBag,
  getLandMiningParams,
  getBagMiningParams,
  getNextMineDelay,
  lastMineTx,
  lastMine,
  doWorkWorker,
  setLandCommission,
} = require("./mine.js");

const {
  getMap,
  getBalance,
  stake,
  unstake,
  getStaked,
  getUnstakes,
  refund,
  getAssets,
  agreeTerms,
  agreedTermsVersion,
} = require("./federation.js");

const {
  federation_account,
  mining_account,
  token_account,
  collection,
  atomic_endpoint,
  aa_api,
  eos_rpc,
} = require("./constants.js");

const AlienWorlds = Object.freeze({
  // mine.js
  setPlayerData,
  setTagData,
  getPlayerData,
  setLand,
  getLand,
  getLandById,
  getPlanets,
  setBag,
  getBag,
  getLandMiningParams,
  getBagMiningParams,
  getNextMineDelay,
  lastMineTx,
  lastMine,
  doWorkWorker,
  setLandCommission,

  // federation.js
  getMap,
  getBalance,
  stake,
  unstake,
  getStaked,
  getUnstakes,
  refund,
  getAssets,
  agreeTerms,
  agreedTermsVersion
});

// Temporary data
// Will be replaced by waxapi later
const { Api } = require("eosjs/dist/index.js");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig.js");
const { TextDecoder, TextEncoder } = require("text-encoding/index.js");

const privatekey = '5KJEamqm4QT2bmDwQEmRAB3EzCrCmoBoX7f6MRdrhGjGgHhzUyf';
const signatureProvider = new JsSignatureProvider([privatekey]);
const eos_api = new Api({
  rpc: eos_rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

module.exports = {
  federation_account,
  mining_account,
  token_account,
  collection,
  atomic_endpoint,
  aa_api,
  eos_rpc,
  eos_api,
  AlienWorlds
}

