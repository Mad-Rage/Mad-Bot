const Event = require("../../Structure/Event");
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { token } = require("../../config")

module.exports = new Event("guildCreate", async (bot, guild) => {

    const commands = [

        new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Permet de connaître la latence du bot"),

        new SlashCommandBuilder()
        .setName("prefix")
        .setDescription("Permet de changer le préfixe du bot")
        .addStringOption(option => option.setName("préfixe").setDescription("Le préfixe que le bot doit avoir").setRequired(true)),

        new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Permet de supprimer un nombre de messages")
        .addStringOption(option => option.setName("nombre").setDescription("Le nombre de messages a effacer").setRequired(true))
    ]
      
    const rest = new REST({ version: "9" }).setToken(token)

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), { body: commands });
})