const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("guildBanAdd", async (bot, ban) => {

    const fetchAuditLogs = await ban.guild.fetchAuditLogs({
        type: 'MEMBER_BAN_ADD',
        limit: 1
    })

    const LatestBan = fetchAuditLogs.entries.first()

    let Embed = new Discord.MessageEmbed()
    .setColor(bot.color)
    .setTitle("Utilisateur banni")
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
    .setDescription(`Banni : ${ban.user} (${ban.user.tag})\nAuteur : ${LatestBan.executor} (${LatestBan.executor.tag})\nRaison : ${ban.reason ? ban.reason : "Aucun raison donnée"}`)

    await bot.channels.cache.get("944932662345351168").send({embeds: [Embed]})
})