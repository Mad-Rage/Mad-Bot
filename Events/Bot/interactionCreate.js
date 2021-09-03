const Discord = require("discord.js")
const Event = require("../../Structure/Event");

module.exports = new Event("interactionCreate", async (bot, interaction) => {

    if(interaction.isCommand()) {

        const command = bot.commands.get(interaction.commandName)

        if(command.permission !== "Aucune" && !interaction.member.permissions.has(new Discord.Permissions(command.permission))) return interaction.reply("Vous n'avez pas la permission requise pour exécuter cette commande !")

        command.run(bot, interaction, interaction.options, bot.db)
    }
})