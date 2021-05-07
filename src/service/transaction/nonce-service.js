const { create } = require('../hash-miner');

class NonceService {
  powGenerator;


  constructor() {
    this.powGenerator = create();
  }

  async generate({ account, difficulty, lastMineTx }) {
    return await this.powGenerator.generate({ account, difficulty, lastMineTx })
  }
}

module.exports = NonceService;
