const { JsonRpc } = require("eosjs/dist/index.js");
const { ExplorerApi } = require("atomicassets/build/index.js");


const atomicassets_account = "atomicassets";
const federation_account = "federation";
const mining_account = "m.federation";
const token_account = "alien.worlds";
const collection = "alien.worlds";
const endpoint = "https://wax.greymass.com";
const atomic_endpoint = ['https://wax.api.atomicassets.io', 'https://wax3.api.atomicassets.io'];
const fetch = require("node-fetch");

const aa_api = new ExplorerApi(atomic_endpoint[0], atomicassets_account, {
  fetch,
  rateLimit: 4,
});
const eos_rpc = new JsonRpc(endpoint, { fetch });

module.exports = {
  atomicassets_account,
  federation_account,
  mining_account,
  token_account,
  collection,
  endpoint,
  atomic_endpoint,
  aa_api,
  eos_rpc
}

