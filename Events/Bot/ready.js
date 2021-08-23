const Discord = require("discord.js")
const Event = require("../../Structure/Event");

module.exports = new Event("ready", async bot => {

    console.log(`${bot.user.username} : En ligne sur ${bot.guilds.cache.size} serveur(s) !`)
})