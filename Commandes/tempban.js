const Discord = require("discord.js")
const ms = require("ms")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "tempban",
    description: "Permet de bannir temporairement un utilisateur",
    utilisation: "[membre] [temps] (raison)",
    alias: ["tempban", "tp"],
    permission: Discord.Permissions.FLAGS.BAN_MEMBERS,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let user = message.user ? bot.users.cache.get(args._hoistedOptions[0].value) : (message.mentions.users.first() || bot.users.cache.get(args[0]))
        if(!user) return message.reply("Aucune personne trouvée !")

        let time = message.user ? args._hoistedOptions[1].value : args[1]
        if(!time) return message.reply("Veuillez un indiquer une durée !")
        if(!parseInt(ms(time))) return message.reply("Le temps indiqué est invalide !")

        let reason = message.user ? (args._hoistedOptions.length > 2 ? args._hoistedOptions[2].value : undefined) : args.slice(2).join(" ");
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous bannir vous-même !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas bannir cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas bannir cette personne !")

        const ID = await bot.function.createID("BAN")

        try {
            await user.send(`${message.user === undefined ? message.author.tag : message.user.tag} vous a banni du serveur ${message.guild.name} pendant ${time} pour la raison ${reason} !`)
        } catch (err) {}

        let sql = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES (${user.id}, '${message.user === undefined ? message.author.id : message.user.id}', '${ID}', '${message.guildId}', '${reason}', '${Date.now()}', '${time}')`
        db.query(sql, function(err) {
            if(err) throw err;
        })

        await message.reply(`${user.tag} a été banni par ${message.user === undefined ? message.author.tag : message.user.tag} pendant ${time} pour la raison ${reason} avec succès !`)

        let sql2 = `INSERT INTO temp (userID, guildID, sanctionID, time) VALUES (${user.id}, '${message.guildId}', '${ID}', '${Date.now() + ms(time)}')`
        db.query(sql2, function(err) {
            if(err) throw err;
        })

        message.guild.members.cache.get(user.id).ban({reason: `${reason} (bannir par ${message.user ? message.user.tag : message.author.tag})`})
    }
})