const Client = require("./Structure/Client")
const bot = new Client();
const { token } = require("./config")

bot.start(token)