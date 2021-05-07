const { transactService } = require('../../service')

class TransactionController {

  async transact(req, res) {
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
  }
}

module.exports = TransactionController;
