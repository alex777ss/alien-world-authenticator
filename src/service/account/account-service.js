const { AlienWorlds, mining_account, federation_account, eos_rpc, aa_api } = require('../../service/alien-worlds')

const accountFieldsRetrievers = {
  balance: async (accountName) => AlienWorlds.getBalance(accountName, eos_rpc),
  lastTx: async (accountName) => AlienWorlds.lastMine(mining_account, accountName, eos_rpc),
  land: async (accountName) => AlienWorlds.getLand(federation_account, mining_account, accountName, eos_rpc, aa_api),
  bag: async (accountName) => AlienWorlds.getBag(mining_account, accountName, eos_rpc, aa_api),
}

function calcMiningParams(land, bag) {
  const bagMiningParams = AlienWorlds.getBagMiningParams(bag);
  const landMiningParams = AlienWorlds.getLandMiningParams(land);
  return {
    delay: bagMiningParams.delay * landMiningParams.delay / 10,
    difficulty: bagMiningParams.difficulty + landMiningParams.difficulty
  }
}

class AccountService {
  async fetchAccountDetails(accountName, fields = ['balance', 'lastTx']) {
    if (typeof fields === 'string') {
      fields = [fields];
    }
    let accountDetails = {};
    for (const field of fields) {
      if (Object.keys(accountFieldsRetrievers).includes(field)) {
        accountDetails[field] = await accountFieldsRetrievers[field](accountName);
        switch (field) {
          case 'land':
            accountDetails.landMiningParams = AlienWorlds.getLandMiningParams(accountDetails[field]);
            break
          case 'bag':
            accountDetails.bagMiningParams = AlienWorlds.getBagMiningParams(accountDetails[field]);
            break
        }
      }
    }

    // const nextMineAt = Date.parse(lastTx.time + '.000Z') + this.mineIntervalSeconds * 1000;
    // const difficulty = await getDifficulty(this.accountName, eos_rpc);
    return accountDetails;
  }
}

module.exports = AccountService;
