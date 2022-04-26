const Discord = require("discord.js")
const ms = require("ms")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "warnlist",
    description: "Permet de connaître toutes les infractions d'un utilisateur",
    utilisation: "[membre] [temps] (raison)",
    alias: ["warnlist", "see", "history", "sanctionlist"],
    permission: Discord.Permissions.FLAGS.MANAGE_MESSAGES,
    category: "Modération",
    cooldown: 10,

    async run(bot, message, args, db) {

        try {

            let user;
            if(message.user ? args._hoistedOptions.length >= 1 : args.length >= 1) {
                user = message.user ? await bot.users.fetch(args.çhoistedOptions[0].value) : (message.mentions.users.first() || await bot.users.fetch(args[0]))
                if(!user) return message.reply("Aucune personne trouvée !")
            } else user = message.user ? message.user : message.author;

            db.query(`SELECT * FROM bans WHERE userID = ${user.id}`, async (err, bans) => {
                db.query(`SELECT * FROM kicks WHERE userID = ${user.id}`, async (err, kicks) => {
                    db.query(`SELECT * FROM mutes WHERE userID = ${user.id}`, async (err, mutes) => {
                        db.query(`SELECT * FROM warns WHERE userID = ${user.id}`, async (err, warns) => {

                            if(bans.length <= 0 && kicks.length <= 0 && mutes.length <= 0 && warns.length <= 0) return message.reply(`\`${user.tag}\` n'aucune sanction !`)

                            let Embed = new Discord.MessageEmbed()
                            .setColor()
                            .setTitle(`Infractions de ${user.tag}`)
                            .setThumbnail(user.displayAvatarURL({dynamic: true}))
                            .setDescription(`Bannissement(s) : ${bans.length}\nExpulsions : ${kicks.length}\nMuets : ${mutes.length}\nAvertissements : ${warns.length}`)
                            .setTimestamp()
                            .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

                            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
                            .setCustomId("ban")
                            .setLabel("Bannissements")
                            .setDisabled(bans.length >= 1 ? false : true)
                            .setStyle("PRIMARY"),
                            new Discord.MessageButton()
                            .setCustomId("kick")
                            .setLabel("Expulsions")
                            .setDisabled(kicks.length >= 1 ? false : true)
                            .setStyle("PRIMARY"),
                            new Discord.MessageButton()
                            .setCustomId("mute")
                            .setLabel("Muets")
                            .setDisabled(mutes.length >= 1 ? false : true)
                            .setStyle("PRIMARY"),
                            new Discord.MessageButton()
                            .setCustomId("warn")
                            .setLabel("Avertissements")
                            .setDisabled(warns.length >= 1 ? false : true)
                            .setStyle("PRIMARY"),
                            new Discord.MessageButton()
                            .setCustomId("cancel")
                            .setLabel("Annuler")
                            .setStyle("DANGER"))

                            let msg = await message.reply({embeds: [Embed], components: [btn]})
                            let filter = async() => true;

                            const collector = (message.user ? (await message.fetchReply()) : msg).createMessageComponentCollector({filter, time: 120000})

                            collector.on("collect", async button => {

                                if(button.user.id !== (message.user ? message.user.id : message.author.id)) return button.reply({content: "Vous n'êtes pas l'auteur du message !", ephemeral: true})

                                if(button.customId === "cancel") return await collector.stop()

                                if(button.customId === "ban") {

                                    await button.deferUpdate()
                                    let description = "";

                                    let newEmbed = new Discord.MessageEmbed()
                                    .setColor(bot.color)
                                    .setTitle(`Bannissement de ${user.tag}`)
                                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

                                    for(let i = 0; i < bans.length; i++) {
                                        description += `**__Bannissement n°${i+1}__**\n\n> **Auteur** : ${bot.users.cache.get(bans[i].authorID)}\n> **Durée** : ${bans[i].time}\n> **Raison** : ${bans[i].reason}\n> **Date** : <t:${Math.floor(parseInt(bans[i].date) / 1000)}:F>\n\n`;
                                    }

                                    newEmbed.setDescription(description)

                                    if(message.user) await message.editReply({embeds: [newEmbed]})
                                    else await msg.edit({embeds: [newEmbed]})
                                }
                                
                                if(button.customId === "kick") {

                                    await button.deferUpdate()
                                    let description = "";

                                    let newEmbed = new Discord.MessageEmbed()
                                    .setColor(bot.color)
                                    .setTitle(`Expulsion de ${user.tag}`)
                                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

                                    for(let i = 0; i < kicks.length; i++) {
                                        description += `**__Expulsion n°${i+1}__**\n\n> **Auteur** : ${bot.users.cache.get(kicks[i].authorID)}\n> **Raison** : ${kicks[i].reason}\n> **Date** : <t:${Math.floor(parseInt(kicks[i].date) / 1000)}:F>\n\n`;
                                    }

                                    newEmbed.setDescription(description)

                                    if(message.user) await message.editReply({embeds: [newEmbed]})
                                    else await msg.edit({embeds: [newEmbed]})
                                }

                                if(button.customId === "mute") {

                                    await button.deferUpdate()
                                    let description = "";

                                    let newEmbed = new Discord.MessageEmbed()
                                    .setColor(bot.color)
                                    .setTitle(`Muet de ${user.tag}`)
                                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

                                    for(let i = 0; i < mutes.length; i++) {
                                        description += `**__Muet n°${i+1}__**\n\n> **Auteur** : ${bot.users.cache.get(mutes[i].authorID)}\n> **Durée** : ${mutes[i].time}\n> **Raison** : ${mutes[i].reason}\n> **Date** : <t:${Math.floor(parseInt(mutes[i].date) / 1000)}:F>\n\n`;
                                    }

                                    newEmbed.setDescription(description)

                                    if(message.user) await message.editReply({embeds: [newEmbed]})
                                    else await msg.edit({embeds: [newEmbed]})
                                }

                                if(button.customId === "warn") {

                                    await button.deferUpdate()
                                    let description = "";

                                    let newEmbed = new Discord.MessageEmbed()
                                    .setColor(bot.color)
                                    .setTitle(`Avertissement de ${user.tag}`)
                                    .setThumbnail(user.displayAvatarURL({dynamic: true}))
                                    .setTimestamp()
                                    .setFooter({text: bot.user.username, iconURL: bot.user.displayAvatarURL({dynamic: true})})

                                    for(let i = 0; i < warns.length; i++) {
                                        description += `__**Avertissement n°${i+1}__**\n\n> **Auteur** : ${bot.users.cache.get(warns[i].authorID)}\n> **Raison** : ${warns[i].reason}\n> **Date** : <t:${Math.floor(parseInt(warns[i].date) / 1000)}:F>\n\n`;
                                    }

                                    newEmbed.setDescription(description)

                                    if(message.user) await message.editReply({embeds: [newEmbed]})
                                    else await msg.edit({embeds: [newEmbed]})
                                }
                            })

                            collector.on("end", async () => {

                                if(message.user) return await message.editReply({components: [], embeds: [message.embeds[0]]})
                                else return await msg.edit({components: [], embeds: [msg.embeds[0]]})
                            })
                        })
                    })
                })
            })

        } catch (err) {

            return message.reply("Aucune personne trouvée !")
        }
    }
})