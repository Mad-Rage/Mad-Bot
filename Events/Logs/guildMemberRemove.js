const Discord = require("discord.js")
const Canvas = require("discord-canvas-easy")
const Event = require("../../Structure/Event")

module.exports = new Event("guildMemberRemove", async (bot, member) => {

    let channel = await bot.channels.cache.get("944926465294762065")

    const Goodbye = await new Canvas.Home()
    .setBackground("./background.jpg")
    .setGuild(member.guild)
    .setUser(member.user)
    .setColorFont("#ffffff")
    .setText(`Au revoir du serveur {server.name}`)
    .toHome()

    await channel.send({files: [new Discord.MessageAttachment(Goodbye.toBuffer(), 'goodbye.png')]})
})