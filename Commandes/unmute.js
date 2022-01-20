const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "unmute",
    description: "Permet de rendrela parole d'un utilisateur",
    utilisation: "[membre] (raison)",
    alias: ["unmute"],
    permission: Discord.Permissions.FLAGS.MODERATE_MEMBERS,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let user = message.user ? bot.users.cache.get(args._hoistedOptions[0].value) : (message.mentions.users.first() || bot.users.cache.get(args[0].value));
        if(!user) return message.reply("Aucune personne trouvée !")

        let reason = message.user ? args._hoistedOptions.length > 1 ? args._hoistedOptions[1].value : undefined : args.slice(1).join(" ")
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous rendre votre propre parole !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas rendre la parole de cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas rendre la parole de cette personne !")
        if(!message.guild.members.cache.get(user.id).isCommunicationDisabled()) return message.reply("Cette personne a déjà sa parole !")

        try {
            await user.send(`${message.user === undefined ? message.author.tag : message.user.tag} vous a rendu votre parole sur le serveur ${message.guild.name} pour la raison ${reason} avec succès !`)
        } catch (err) {}

        await message.reply(`${message.user === undefined ? message.author : message.user} a rendu la parole de ${user.tag} pour la raison ${reason} avec succès !`)

        message.guild.members.cache.get(user.id).timeout(null, `${reason} (Parole rendu par ${message.user === undefined ? message.author.tag : message.user.tag})`)
    }
})