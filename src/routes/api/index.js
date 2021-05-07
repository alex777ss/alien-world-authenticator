const express = require('express');
const router = express.Router();
const {
  AccountController,
  AuthorizationController,
  transactionController,
  proofOfWorkController
} = require('../../controllers');


router.get('/account/search', (req, res) => AccountController.search(req, res));
router.get('/account/login/:accountName', AuthorizationController.login);
router.get('/account/:accountName/wallet', AccountController.openWalletInBrowser);
router.post('/transact/pow-generate', proofOfWorkController.generatePoW);
router.post('/transact', transactionController.transact);

module.exports = router;
