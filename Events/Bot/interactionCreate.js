const Discord = require("discord.js")
const Event = require("../../Structure/Event");

module.exports = new Event("interactionCreate", async (bot, interaction) => {

    if(interaction.isCommand()) {

        const command = bot.commands.get(interaction.commandName)

        command.run(bot, interaction, interaction.options, bot.db)
    }
})