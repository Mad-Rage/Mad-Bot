const Discord = require("discord.js")
const Event = require("../../Structure/Event");
const SlashCommand = require("../../Structure/SlashCommand")

module.exports = new Event("ready", async bot => {

    await SlashCommand(bot);

    bot.user.setStatus("online")

    setTimeout(async () => {

        const activités = ["la v13 de discord.js", "le développement", "Mad Rage le youtubeur", `${bot.users.cache.size} utilisateurs`, `${bot.guilds.cache.size} serveurs`]
        const activities = activités[Math.floor(Math.random() * activités.length - 1)]

        bot.user.setActivity(activities, { type: "WATCHING"})

    }, 15000)

    console.log(`${bot.user.username} : En ligne sur ${bot.guilds.cache.size} serveur(s) !`)
})