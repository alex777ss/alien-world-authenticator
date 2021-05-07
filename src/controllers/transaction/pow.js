const { nonceService } = require('../../service')

class ProofOfWorkController {

  async generatePoW(req, res) {
    const payload = req.body;
    if (!payload.account || !payload.lastMineTx) {
      return res.status(400).send({
        message: 'invalid data: ' + JSON.stringify(payload)
      });
    }

    try {
      const result = await nonceService.generate(payload);
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: error.message
      });
    }
  }
}

module.exports = ProofOfWorkController;
