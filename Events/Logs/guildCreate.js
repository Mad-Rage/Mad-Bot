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
        .addStringOption(option => option.setName("nombre").setDescription("Le nombre de messages a effacer").setRequired(true)),

        new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Permet de connaître l'expérience d'un utilisateur")
        .addUserOption(option => option.setName("membre").setDescription("Le membre où vous voulez l'expérience").setRequired(false)),

        new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Permet de connaître les utilisateurs avec le plus d'expérience !"),

        new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Permet de bannir définitivement un utilisateur")
        .addUserOption(option => option.setName("membre").setDescription("Le membre à bannir").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("La raison du bannissement").setRequired(false)),

        new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Permet d'expulser un utilisateur")
        .addUserOption(option => option.setName("membre").setDescription("Le membre à expulser").setRequired(true))
        .addStringOption(option => option.setName("raison").setDescription("La raison de l'expulsion").setRequired(false)),

        new SlashCommandBuilder()
        .setName("restart")
        .setDescription("Permet de redémarrer le bot !"),

        new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Permet de stopper le bot !"),

        new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Permet d'évaluer un code")
        .addStringOption(option => option.setName("code").setDescription("Le code à évaluer").setRequired(true)),

        new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Permet de recharger une commande")
        .addStringOption(option => option.setName("commande").setDescription("La commande a recharger").setRequired(true))
    ]
      
    const rest = new REST({ version: "9" }).setToken(token)

    await rest.put(Routes.applicationGuildCommands(bot.user.id, guild.id), { body: commands });
})