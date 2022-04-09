const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "userinfo",
    description: "Permet d'avoir des informations sur un utilisateur",
    utilisation: "(membre)",
    alias: ["userinfo", "ui"],
    permission: "Aucune",
    category: "Information",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {

            let user;
            if(message.user ? args._hoistedOptions.length >= 1 : args.length >= 1) {
                user = message.user ? await bot.users.fetch(args._hoistedOptions[0].value) : (message.mentions.users.first() || await bot.users.fetch(args[0]))
                if(!user) return message.reply("Aucune personne trouvée !")
            } else user = message.user ? message.user : message.author;
            let member = message.guild.members.cache.get(user.id)

            let Embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setTitle(`Informations sur ${user.tag}`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .addField("Informations sur l'utilisateur", `**Pseudo** : ${user.username}\n**Tag** : ${user.discriminator}\n**URL de l'avatar** : [URL](${user.displayAvatarURL({dynamic: true})})\n**Robot** : ${user.bot ? "Oui" : "Non"}\n**Status** : ${member ? member.presence ? member.presence.status : "Hors-ligne" : "Inconnu"}\n**Badges** : ${(await user.fetchFlags()).toArray().length >= 1 ? (await user.fetchFlags()).toArray().join(" ") : "Non"}\n**Date de création du compte** : <t:${Math.floor(user.createdAt / 1000)}:F>\n`)
            member ? Embed.addField("Informations sur l'utilisateur", `**Surnom** : ${member.nickname ? member.nickname : "Aucun"}\n**Rôles (${member.roles.cache.size})** : ${member.roles.cache.map(r => `${r}`).join(" ")}\n**Date d'arrivée sur le serveur** : <t:${Math.floor(member.joinedAt / 1000)}:F>`) : ""
            Embed.setImage(await (await bot.users.fetch(user.id, {force: true})).bannerURL({dynamic: true, size: 4096}))
            .setTimestamp()
            .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

            await message.reply({embeds: [Embed]})

        } catch (err) {

            return message.reply("Aucune personne trouvée !")
        }
    }
})