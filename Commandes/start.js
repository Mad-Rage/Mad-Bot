const Discord = require("discord.js")
const ms = require("ms")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "start",
    description: "Permet de créer un concours",
    utilisation: "[salon] [nombre de gagnants] [temps] [prix]",
    alias: ["start", "gstart"],
    permission: Discord.Permissions.FLAGS.MANAGE_GUILD,
    category: "Concours",
    cooldown: 10,

    async run(bot, message, args, db) {

        let channel = message.user ? message.guild.channels.cache.get(args._hoistedOptions[0].value) : (message.mentions.channels.first() || message.guild.channels.cache.get(args[0]))
        if(!channel) return message.reply("Aucun salon trouvé !")
        if(channel.type !== "GUILD_TEXT") return message.reply("Le salon doit être un salon textuel !")

        let winners = message.user ? args._hoistedOptions[1].value : args[1];
        if(!winners) return message.reply("Veuillez indiquer un nombre de gagnant !")
        if(isNaN(winners)) return message.reply("Veuillez indiquer un nombre de gagnant !")
        if(parseInt(winners) <= 0) return message.reply("Veuillez indiquer un nombre plus grand que 0 !")

        let time = message.user ? args._hoistedOptions[2].value : args[2];
        if(!time) return message.reply("Veuillez indiquer un temps !")
        if(isNaN(ms(time))) return message.reply("Veuillez indiquer un temps valide !")

        let price = message.user ? args._hoistedOptions[3].value : args.slice(3).join(" ");
        if(!price) return message.reply("Veuillez indiquer un prix !")

        const ID = await bot.function.createID("GIVEAWAY")

        let sql = `INSERT INTO giveaways (guildID, channelID, giveawayID, authorID, price, winners, date, finish) VALUES (${message.guildId}, '${channel.id}', '${ID}', '${message.author ? message.author.id : message.user.id}', '${price.replace(/'/g, "\\'")}', '${winners}', '${Date.now() + ms(time)}', 'non')`
        db.query(sql, function(err) {
            if(err) throw err;
        })

        let Embed = new Discord.MessageEmbed()
        .setColor(bot.color)
        .setTitle("Nouveau concours")
        .setDescription(`**Auteur** : ${message.user ? message.user : message.author}\n**Prix** : ${price}\n**Gagnant(s)** : ${winners}\n**Date de fin** : <t:${Math.round((Date.now() + ms(time)) / 1000)}:F>`)
        .setTimestamp()
        .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

        const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
        .setStyle("SUCCESS")
        .setLabel("Participer/départiciper du concours")
        .setCustomId(`giveaway_${ID}`)
        .setEmoji("🎉"))

        await message.reply("Concours créé avec succès !")
        await channel.send({embeds: [Embed], components: [btn]})
    }
})