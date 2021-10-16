const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "prefix",
    description: "Permet de changer le préfixe du bot",
    utilisation: "[préfixe]",
    alias: ["prefix", "setprefix", "sp"],
    permission: Discord.Permissions.FLAGS.ADMINISTRATOR,
    category: "Système",
    cooldown: 10,

    async run(bot, message, args, db) {

        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, req) => {

            try {

                let prefix = args[0] || args._hoistedOptions[0].value
                if(!prefix) return message.reply("Veuillez indiquer un préfixe !")

                const ancienprefix = req[0].prefix;

                db.query(`UPDATE serveur SET prefix = '${prefix}' WHERE guildID = ${message.guild.id}`)

                message.reply(`Vous avez modifié le préfixe, c'est passé de \`${ancienprefix}\` à \`${prefix}\` !`)

            } catch (err) {
                return message.reply("Veuillez indiquer un préfixe !")
            }
        })
    }
})