const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("voiceStateUpdate", async (bot, oldvoice, newvoice) => {

    let oldchannel = oldvoice.channel;
    let newchannel = newvoice.channel;
    let user = newvoice.guild.members.cache.get(newvoice.id).user || oldvoice.guild.members.cache.get(oldvoice.id).user;

    if(newchannel?.id === "975365971248291900") {

        let channel = await newchannel.guild.channels.create(`${user.username}`, {type: "GUILD_VOICE"})
        await channel.setParent(newchannel.parentId);

        newvoice.guild.members.cache.get(newvoice.id).voice.setChannel(channel)
    }

    if(oldchannel?.parentId === "875659838842085378" && oldchannel?.id !== "975365971248291900") {

        if(oldchannel.members.size <= 0) await oldchannel.delete()
    }
})