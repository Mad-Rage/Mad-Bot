const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "stop",
    description: "Permet de stopper le bot",
    utilisation: "",
    alias: ["stop"],
    permission: "Développeur",
    category: "Système",
    cooldown: 10,

    async run(bot, message, args, db) {

        await message.reply("Le bot a été arrêté avec succès !")

        await require("child_process").execSync("pm2 stop MadBot")
    }
})