const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "ban",
    description: "Permet de bannir définitivement un utilisateur",
    utilisation: "[membre] (raison)",
    alias: ["ban"],
    permission: Discord.Permissions.FLAGS.BAN_MEMBERS,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        let user = message.user === undefined ? (message.mentions.users.first() || bot.users.cache.get(args[0])) : bot.users.cache.get(args._hoistedOptions[0].value)
        if(!user) return message.reply("Aucune personne trouvée !")

        let reason = message.user ? (args._hoistedOptions.length > 1 ? args._hoistedOptions[1].value : undefined) : args.slice(1).join(" ");
        if(!reason) reason = "Aucune raison donnée";

        if(message.user === undefined ? (user.id === message.author.id) : (user.id === message.user.id)) return message.reply("Vous ne pouvez pas vous bannir vous-même !")
        if(user.id === message.guild.ownerId) return message.reply("Vous ne pouvez pas bannir cette personne !")
        if(message.member.roles.highest.comparePositionTo(message.guild.members.cache.get(user.id).roles.highest) <= 0) return message.reply("Vous ne pouvez pas bannir cette personne !")

        try {
            await user.send(`${message.user === undefined ? message.author.tag : message.user.tag} vous a banni du serveur ${message.guild.name} pour la raison ${reason} !`)
        } catch (err) {}

        const ID = await bot.function.createID("BAN")

        const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
        .setStyle("DANGER")
        .setLabel("Débannir")
        .setCustomId("unban")
        .setEmoji("🔓"))

        await message.reply({content: `${user.tag} a été banni par ${message.user === undefined ? message.author.tag : message.user.tag} pour la raison ${reason} avec succès !`, components: [btn]}).then(async msg => {

            await message.guild.members.cache.get(user.id).ban({reason: `${reason} (Banni par ${message.user === undefined ? message.author.tag : message.user.tag})`})

            if(reason.includes("'")) reason = reason.replace(/'/g, "\\'")

            let sql = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES (${user.id}, '${message.user === undefined ? message.author.id : message.user.id}', '${ID}', '${message.guildId}', '${reason}', '${Date.now()}', 'Définitif')`
            db.query(sql, function(err) {
                if(err) throw err;
            })

            const filter = async() => true;
            const collector = msg.createMessageComponentCollector({filter})

            collector.on("collect", async button => {

                if(!button.member.permissions.has(new Discord.Permissions(Discord.Permissions.FLAGS.BAN_MEMBERS))) return button.reply({content: "Vous n'avez pas la permission requise pour cliquer sur ce bouton !", ephemeral: true})

                if(button.customId === "unban") {

                    await message.guild.members.unban(user.id)

                    await button.reply(`${button.user.tag} a débanni ${user.tag} !`)

                    await collector.stop()
                }
            })
        })
    }
})