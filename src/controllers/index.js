const AccountController = require("./account");
const AuthorizationController = require("./account/authorization");
const TransactionController = require("./transaction");
const ProofOfWorkController = require("./transaction/pow");


const transactionController = new TransactionController();
const proofOfWorkController = new ProofOfWorkController();

module.exports = {
  AccountController,
  proofOfWorkController,
  transactionController,
  AuthorizationController,
}
