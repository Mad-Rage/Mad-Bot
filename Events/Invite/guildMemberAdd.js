const Discord = require("discord.js")
const InviteEvent = require("../../Structure/InviteEvent")

module.exports = new InviteEvent("guildMemberAdd", async (bot, member, type, invite) => {

    let channel = await bot.channels.cache.get("944926465294762065")

    if(type === "normal") await channel.send(`Bienvenue ${member.user} ! Vous avez été invité par ${invite.inviter} !`)
    else if(type === "vanity") await channel.send(`Bienvenue ${member.user} ! Vous avez rejoins grâce à la vanity URL \`https://discord.gg/${member.guild.vanityURLCode}\` !`)
    else await channel.send(`Bienvenue ${member.user} !`)
})