const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "snipe",
    description: "Permet de connaître le dernier message supprimé du salon",
    utilisation: "",
    alias: ["snipe"],
    permission: Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let msg = await bot.snipe.get(message.channel.id)
        
        if(!msg) return message.reply("Aucun message supprimé récemment !")

        let Embed = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setTitle(`Message supprimé de ${msg.author.tag}`)
        .setDescription(msg.content)
        .setImage(msg.attachments?.first()?.proxyURL)

        await message.reply({embeds: [Embed]})
    }
})