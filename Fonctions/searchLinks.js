module.exports = async (message) => {

    if(message.channel.id === "947877033353031691") return;
    if(message.content.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g))) {

        await message.delete()

        await message.channel.send(`Attention ${message.author}, les liens ne sont pas acceptés dans ce salon !`)
    }
}