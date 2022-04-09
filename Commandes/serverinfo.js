const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "serverinfo",
    description: "Permet d'avoir des informations sur le serveur",
    utilisation: "(membre)",
    alias: ["serverinfo", "si"],
    permission: "Aucune",
    category: "Information",
    cooldown: 0,

    async run(bot, message, args, db) {

        let Embed = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setTitle(`Informations sur le serveur ${message.guild.name}`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addField("Informations sur le serveur", `**Nom** : ${message.guild.name}\n**Propriétaire** : ${(await message.guild.fetchOwner())}\n**ID** : ${message.guild.id}\n**Description** : ${message.guild.description ? message.guild.description : "Aucune"}\n**Boost** : ${message.guild.premiumSubscriptionCount} (${message.guild.premiumTier})\n**Date de création** : <t:${Math.floor(message.guild.createdAt / 1000)}:F>`)
        .addField("Informations sur les stats", `**Salons** : ${message.guild.channels.cache.size}\n**Rôles** : ${message.guild.roles.cache.size}\n**Emojis** : ${message.guild.emojis.cache.size}\n**Membres** : ${message.guild.members.cache.size}`)
        .addField("Informations sur les salons spéciaux", `**Règlement** : ${message.guild.rulesChannel ? message.guild.rulesChannel : "Aucun"}\n**AFK** : ${message.guild.afkChannel ? message.guild.rulesChannel : "Aucun"}`)
        .setImage(message.guild.bannerURL({ dynamic: true, size: 4096 }))
        .setTimestamp()
        .setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        await message.reply({ embeds: [Embed] })
    }
})