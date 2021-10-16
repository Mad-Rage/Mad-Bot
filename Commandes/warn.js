const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "warn",
    description: "Permet d'avertir un utilisateur",
    utilisation: "[membre] (raison)",
    alias: ["warn", "warning"],
    permission: Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let user = message.user ? bot.users.cache.get(args._hoistedOptions[0].value) : (bot.users.cache.get(args[0]) || message.mentions.users.first())
        if(!user) return message.reply("Aucune personne trouvée !")
        if(!message.guild.members.cache.get(user.id)) return message.reply("Aucune personne trouvée !")

        let reason = message.user ? args._hoistedOptions.length >= 2 ? args._hoistedOptions[1].value : undefined : args.slice(1).join("")
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous avertir vous-même !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas avertir cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas avertir cette personne !")

        const ID = await bot.function.createID("WARN")

        await message.reply(`${message.user ? message.user.tag : message.author.tag} a averti ${user.tag} pour la raison ${reason} !`)
        try {
            await user.send(`${message.user ? message.user.tag : message.author.tag} vous a averti pour la raison ${reason} !`)
        } catch (err) {}
        
        let sql = `INSERT INTO warns (userID, authorID, warnID, guildID, reason, date) VALUES (${user.id}, '${message.user ? message.user.id : message.author.id}', '${ID}', '${message.guildId}', '${reason}', '${Date.now()}')`
        db.query(sql, function(err) {
            if(err) throw err;
        })
    }
})