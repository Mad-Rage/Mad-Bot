const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("messageDelete", async (bot, message) => {

    if(bot.snipe.get(message.channel.id)) await bot.snipe.delete(message.channel.id) && await bot.snipe.set(message.channel.id, message)
    else await bot.snipe.set(message.channel.id, message);

    if(message.author.bot) return;

    const AuditsLogs = await message.guild.fetchAuditLogs({
        type: 'MESSAGE_DELETE',
        limit: 1
    })

    const LatestMessageDeleted = AuditsLogs.entries.first();
    
    let Embed = new Discord.MessageEmbed()
    .setColor(bot.color)
    .setTitle("Message supprimé")
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
    .setDescription(`Auteur du message : ${message.author}\nAuteur de la suppresion : ${LatestMessageDeleted.executor}\nDate de création du message : <t:${Math.floor(message.createdAt / 1000)}:F>\nContenu : \`\`\`${message.content}\`\`\``)

    await bot.channels.cache.get("944932662345351168").send({embeds: [Embed]})
})