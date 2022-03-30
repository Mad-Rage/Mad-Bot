const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "unlock",
    description: "Permet de unlocker un salon",
    utilisation: "[channel] (reason)",
    alias: ["unlock"],
    permission: Discord.Permissions.FLAGS.MANAGE_CHANNELS,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let channel = message.user ? message.guild.channels.cache.get(args._hoistedOptions[0].value) : (message.mentions.channels.first() || message.guild.channels.cache.get(args[0]))
        if(!channel) return message.reply("Aucun salon trouvé !")

        let reason = message.user ? args._hoistedOptions.length > 1 ? args._hoistedOptions[1].value : undefined : args.slice(1).join(" ");
        if(!reason) reason = "Aucune raison donnée";

        if(channel.permissionOverwrites.cache.get(message.guild.roles.everyone.id)?.allow.toArray(false).includes("SEND_MESSAGES")) return message.reply("Ce salon est déjà unlocké !")

        await channel.permissionOverwrites.edit(message.guild.roles.everyone.id, {
            SEND_MESSAGES: true
        })

        await message.reply(`Le salon a été unlock avec succès ! \`${reason}\``)
        await channel.send(`Ce salon a été unlocké par ${message.user ? message.user : message.author} ! \`${reason}\``)
    }
})