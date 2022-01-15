const Discord = require("discord.js")
const ms = require("ms")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "mute",
    description: "Permet de rendre temporairement muet un utilisateur",
    utilisation: "[membre] (raison)",
    alias: ["mute", "tempmute"],
    permission: Discord.Permissions.FLAGS.MODERATE_MEMBERS,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let user = message.user === undefined ? (message.mentions.users.first() || bot.users.cache.get(args[0])) : bot.users.cache.get(args._hoistedOptions[0].value)
        if(!user) return message.reply("Aucune personne trouvée !")

        let time = message.user ? args._hoistedOptions[1].value : args[1]
        if(!time) return message.reply("Veuillez un indiquer une durée !")
        if(!parseInt(ms(time))) return message.reply("Le temps indiqué est invalide !")
        if(ms(time) > 2419200000) return message.reply("Le temps ne doit pas être supérieur à 28 jours !")

        let reason = message.user ? (args._hoistedOptions.length > 2 ? args._hoistedOptions[2].value : undefined) : args.slice(2).join(" ");
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous rendre muet vous-même !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas rendre muet cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas rendre muet cette personne !")
        if(message.guild.members.cache.get(user.id).isCommunicationDisabled()) return message.reply("Cette personne est déjà muette !")

        try {
            await user.send(`${message.user === undefined ? message.author.tag : message.user.tag} vous a rendu muet pendant ${time} du serveur ${message.guild.name} pour la raison ${reason} !`)
        } catch (err) {}

        const ID = await bot.function.createID("MUTE")

        let sql = `INSERT INTO mutes (userID, authorID, muteID, guildID, reason, date, time) VALUES (${user.id}, '${message.user === undefined ? message.author.id : message.user.id}', '${ID}', '${message.guildId}', '${reason}', '${Date.now()}', '${time}')`
        db.query(sql, function(err) {
            if(err) throw err;
        })

        await message.guild.members.cache.get(user.id).timeout(ms(time), reason)

        await message.reply({content: `${user.tag} a été rendu muet par ${message.user === undefined ? message.author.tag : message.user.tag} pendant ${time} pour la raison ${reason} avec succès !`})
    }
})