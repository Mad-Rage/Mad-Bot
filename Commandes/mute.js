const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "mute",
    description: "Permet de rendre muet un utilisateur",
    utilisation: "[membre] (raison)",
    alias: ["mute"],
    permission: Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    category: "Modération",

    async run(bot, message, args, db) {

        
    }
})