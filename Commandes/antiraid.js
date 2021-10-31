const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "antiraid",
    description: "Permet d'activer ou de désactiver le monde anti-raid",
    utilisation: "[on/off]",
    alias: ["antiraid", "raid"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Administration",
    cooldown: 10,

    async run(bot, message, args, db) {

        let choix = message.user ? args._hoistedOptions[0].value : args[0]
        if(!choix) return message.reply("Veuillez indiquer \`on\` ou \`off\` !")
        if(choix !== "on" && choix !== "off") return message.reply("Veuillez indiquer \`on\` ou \`off\` !")

        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guildId}`, async (err, req) => {

            if(req.length < 1) return message.reply("Ce serveur n'est pas encore enregistré !")
            if(req[0].raid === choix) return message.reply(`L'anti-raid est déjà ${choix === "on" ? "activé" : "désactivé"} !`)

            db.query(`UPDATE serveur SET raid = '${choix}' WHERE guildID = ${message.guildId}`)

            message.reply(`L'anti-raid est a été ${choix === "on" ? "activé" : "désactivé"} !`)
        })
    }
})