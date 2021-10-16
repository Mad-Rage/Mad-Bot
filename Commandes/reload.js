const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "reload",
    description: "Permet de recharger une commande",
    utilisation: "[commande]",
    alias: ["reload", "re"],
    permission: "Développeur",
    category: "Système",
    cooldown: 10,

    async run(bot, message, args, db) {

        const command = bot.alias.get(message.user ? args._hoistedOptions[0].value : args[0])
        if(!command) return message.reply("Veuillez indiquer une commande !")

        await message.reply("En cours...").then(async msg => {

            delete require.cache[require.resolve(`./${command.name}.js`)]
            bot.commands.delete(command.name)

            const pull = require(`./${command.name}.js`)
            bot.commands.get(pull.name, pull)

            try {
                await msg.edit(`La commande \`${command.name}.js\` a été rechargée avec succès !`)
            } catch (err) {
                await message.editReply(`La commande \`${command.name}.js\` a été rechargée avec succès !`)
            }
        })
    }
})