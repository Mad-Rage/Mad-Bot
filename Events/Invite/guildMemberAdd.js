const Discord = require("discord.js")
const Canvas = require("discord-canvas-easy")
const InviteEvent = require("../../Structure/InviteEvent")

module.exports = new InviteEvent("guildMemberAdd", async (bot, member, type, invite) => {

    let channel = await bot.channels.cache.get("944926465294762065")

    let text;
    if(type === "normal") text = `Bienvenue ${member.user} ! Vous avez été invité par ${invite.inviter} !`
    else if(type === "vanity") text = `Bienvenue ${member.user} ! Vous avez rejoins grâce à la vanity URL \`https://discord.gg/${member.guild.vanityURLCode}\` !`
    else text = `Bienvenue ${member.user} !`

    const Welcome = await new Canvas.Home()
    .setBackground("./background.jpg")
    .setGuild(member.guild)
    .setUser(member.user)
    .setColorFont("#ffffff")
    .setText(`Bienvenue sur le serveur {server.name}`)
    .toHome()

    await channel.send({files: [new Discord.MessageAttachment(Welcome.toBuffer(), 'welcome.png')], content: text})
})