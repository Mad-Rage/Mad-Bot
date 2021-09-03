const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "ban",
    description: "Permet de bannir définitivement un utilisateur",
    utilisation: "ban [membre] (raison)",
    permission: Discord.Permissions.FLAGS.BAN_MEMBERS,
    category: "Modération",

    async run(bot, message, args, db) {

        let user = message.user === undefined ? (message.mentions.users.first() || bot.users.cache.get(args[0])) : bot.users.cache.get(args._hoistedOptions[0].value)
        if(!user) return message.reply("Aucune personne trouvée !")

        let reason = message.user === undefined ? args.slice(1).join(" ") : args._hoistedOptions[1].value;
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous bannir vous-même !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas bannir cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas bannir cette personne !")

        try {
            await user.send(`${message.user === undefined ? message.author.tag : message.user.tag} vous a banni du serveur ${message.guild.name} pour la raison ${reason} !`)
        } catch (err) {}
        await message.reply(`${user.tag} a été banni par ${message.user === undefined ? message.author.tag : message.user.tag} pour la raison ${reason} avec succès !`)

        await message.guild.members.cache.get(user.id).ban({reason: `${reason} (Banni par ${message.user === undefined ? message.author.tag : message.user.tag})`})
    }
})