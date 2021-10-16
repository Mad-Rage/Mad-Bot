const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "help",
    description: "Permet de connaître toutes les commandes du bot",
    utilisation: "",
    alias: ["help", "h", "aide"],
    permission: "Aucune",
    category: "Information",
    cooldown: 2,

    async run(bot, message, args, db) {

        const command = message.user ? bot.alias.get(args._hoistedOptions.length !== 0 ? args._hoistedOptions[0].value : "") : bot.alias.get(args[0])
        
        db.query(`SELECT * FROM serveur WHERE guildID = ${message.guildId}`, async (err, req) => {

            if(!command) {
            
                const categories = [];
                const commands = bot.commands;
        
                commands.forEach((command) => {
                    if(!categories.includes(command.category)) {
                        categories.push(command.category);
                    }
                });
    
                let Embed = new Discord.MessageEmbed()
                .setColor(bot.color)
                .setTitle(`Toutes les commandes du bot`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription("Voici toutes les commandes du bot")
                .setTimestamp()
                .setFooter(`${message.user ? message.user.username : message.author.username}`, message.user ? message.user.displayAvatarURL({dynamic: true}) : message.author.displayAvatarURL({dynamic: true}))
    
                categories.sort().forEach((cat, i) => {
                    const tCommands = commands.filter((cmd) => cmd.category === cat);
                    Embed.addField(cat, tCommands.map((cmd) => "> `" + req[0].prefix + cmd.name + "` ➔ " + cmd.description).join("\n"));
                });
    
                message.reply({embeds: [Embed]})

            }

            if(command) {

                let Embed = new Discord.MessageEmbed()
                .setColor(bot.color)
                .setTitle(`Toutes les commandes du bot`)
                .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
                .setDescription(`Nom de la commande : \`${message.user ? args._hoistedOptions[0].value : args[0]}\`\nDescription de la commande : \`${command.description}\`\nUtilisation de la commande : \`${message.user ? args._hoistedOptions[0].value : args[0]} ${command.utilisation}\`\nAlias de la commande : ${command.alias.filter(a => a !== (message.user ? args._hoistedOptions[0].value : args[0])).map(a => `\`${a}\``).join(" ")}\nCatégorie de la commande : \`${command.category}\`\nPermission de la commande : \`${new Discord.Permissions(command.permission).toArray(false)}\``)
                .setTimestamp()
                .setFooter(`${message.user ? message.user.username : message.author.username}`, message.user ? message.user.displayAvatarURL({dynamic: true}) : message.author.displayAvatarURL({dynamic: true}))

                message.reply({embeds: [Embed]})
            }
        })
    }
})