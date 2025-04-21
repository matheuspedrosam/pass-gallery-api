const express = require("express");
const router = express.Router();
const ClientController = require("../controllers/clientController.js")

router.post("/create", ClientController.createCliente)

module.exports = router;