const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("guildBanRemove", async (bot, ban) => {

    const fetchAuditLogs = await ban.guild.fetchAuditLogs({
        type: 'MEMBER_BAN_REMOVE',
        limit: 1
    })

    const LatestUnban = fetchAuditLogs.entries.first()

    let Embed = new Discord.MessageEmbed()
    .setColor(bot.color)
    .setTitle("Utilisateur débanni")
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
    .setDescription(`Débanni : ${ban.user} (${ban.user.tag})\nAuteur : ${LatestUnban.executor} (${LatestUnban.executor.tag})\nRaison : ${ban.reason ? ban.reason : "Aucun raison donnée"}`)

    await bot.channels.cache.get("944932662345351168").send({embeds: [Embed]})
})