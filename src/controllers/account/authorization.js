const { loginService } = require('../../service');

class AuthorizationController {

  async login(req, res) {
    const accountName = req.params.accountName;
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
  }
}

module.exports = new AuthorizationController();
