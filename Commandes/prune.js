const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "prune",
    description: "Permet de supprimer un nombre de messages d'un utilisateur",
    utilisation: "[membre] [nombre de messages]",
    alias: ["prune"],
    permission: Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    category: "Modération",
    cooldown: 0,

    async run(bot, message, args, db) {

        try {

            let user = message.user ? await bot.users.fetch(args._hoistedOptions[0].value) : (message.mentions.users.first() || await bot.users.fetch(args[0]))
            if(!user) return message.reply("Aucune personne trouvée !")

            let number = message.user ? args._hoistedOptions[1].value : args[1];
            if(!number) return message.reply("Veuillez indiquer un nombre entre \`1\` et \`100\` inclus !")
            if(isNaN(number)) return message.reply("Veuillez indiquer un nombre entre \`1\` et \`100\` inclus !")
            if(parseInt(number) < 1 || parseInt(number) > 100) return message.reply("Veuillez indiquer un nombre entre \`1\` et \`100\` inclus !")

            await message.delete()

            try {

                let messages = [...(await message.channel.messages.fetch()).values()].filter(m => m.author.id === user.id).slice(0, parseInt(number));
                if(messages.length <= 0) return message.channel.send(`\`${user.tag}\` n'a envoyé aucun message dans ce salon !`)

                let msg = await message.channel.bulkDelete(messages)

                await message.channel.send(`Le robot a supprimé \`${msg.size}\` message(s) de \`${user.tag}\` avec succès !`)

            } catch (err) {

                let messages = [...(await message.channel.messages.fetch()).values()].filter(m => m.author.id === user.id && m.createdAt > (Date.now() - 1209600000)).slice(0, parseInt(number));
                if(messages.length <= 0) return message.channel.send(`\`${user.tag}\` n'a envoyé aucun message dans ce salon les 14 derniers jours !`)

                let msg = await message.channel.bulkDelete(messages)

                await message.channel.send(`Le robot a supprimé \`${msg.size}\` message(s) de \`${user.tag}\` car les autres dataient de plus de 14 jours avec succès !`)
            }
        
        } catch (err) {

            return message.reply("Aucune personne trouvée !")
        }
    }
})