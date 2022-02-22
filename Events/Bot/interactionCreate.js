const Discord = require("discord.js")
const transcript = require("discord-html-transcripts")
const Event = require("../../Structure/Event");

module.exports = new Event("interactionCreate", async (bot, interaction) => {

    if(interaction.isCommand()) {

        const command = bot.commands.get(interaction.commandName)

        if(!bot.cooldown.has(command.name)) {
            bot.cooldown.set(command.name, new Discord.Collection())
        }

        const time = Date.now();
        const cooldown = bot.cooldown.get(command.name);
        const timeCooldown = (command.cooldown || 5) * 1000;

        if(cooldown.has(interaction.user.id)) {

            const timeRestant = cooldown.get(interaction.user.id) + timeCooldown;

            if(time < timeRestant) {

                const timeLeft = (timeRestant - time);

                return interaction.reply(`Vous devez attendre ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60 * 24) % 30))}\`` + ` jour(s) ` + `\`${(Math.round(timeLeft / (1000 * 60 * 60)))}\`` + ` heure(s) ` + `\`${(Math.round(timeLeft / (1000 * 60) % 60))}\`` + ` minute(s) ` + `\`${(Math.round(timeLeft / 1000 % 60))}\`` + ` seconde(s) pour exécuter cette commande !`)
            }
        }

        cooldown.set(interaction.user.id, time);
        setTimeout(() => cooldown.delete(interaction.user.id), timeCooldown);

        if(command.permission === "Développeur" && interaction.user.id !== "499974131572539392") return interaction.reply("Vous n'avez pas la permission requise pour exécuter cette commande !")
        if(command.permission !== "Aucune" && command.permission !== "Développeur" && !interaction.member.permissions.has(new Discord.Permissions(command.permission))) return interaction.reply("Vous n'avez pas la permission requise pour exécuter cette commande !")

        command.run(bot, interaction, interaction.options, bot.db)
    }

    if(interaction.isButton()) {

        if(interaction.customId === "ticket") {

            let channel = await interaction.guild.channels.create(`ticket-${interaction.user.username}`, {type: "GUILD_TEXT"})
            await channel.setParent(interaction.channel.parentId)

            await channel.permissionOverwrites.create(interaction.user, {
                SEND_MESSAGES: true,
                EMBED_LINKS: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true
            })
            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                SEND_MESSAGES: false,
                EMBED_LINKS: false,
                VIEW_CHANNEL: false,
                READ_MESSAGE_HISTORY: false
            })

            await interaction.reply({content: `Votre ticket a été créé avec succès ${channel} !`, ephemeral: true})
            
            let Embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setTitle("Ticket créé")
            .setDescription(`${interaction.user.tag} a créé ce ticket, merci de lui répondre !`)
            .setThumbnail(interaction.user.displayAvatarURL({dynamic: true}))
            .setTimestamp()
            .setFooter({text: bot.user.tag, iconURL: bot.user.displayAvatarURL({dynamic: true})})

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
            .setStyle("DANGER")
            .setEmoji("🔒")
            .setLabel("Fermer le ticket")
            .setCustomId("close"),
            new Discord.MessageButton()
            .setStyle("PRIMARY")
            .setEmoji("📑")
            .setLabel("Demander le transcript")
            .setCustomId("transcript"))

            await channel.send({embeds: [Embed], components: [btn]})
        }

        if(interaction.customId === "transcript") {

            await interaction.deferReply()
            await bot.channels.cache.get("944932662345351168").send({content: `Transcript de ${interaction.message.embeds[0].description.split(" ")[0]}`, files: [await transcript.createTranscript(interaction.channel)]})
            await interaction.editReply({content: "Transcript envoyé avec succès !", ephemeral: true})
        }

        if(interaction.customId === "close") {

            let user = interaction.guild.members.cache.find(m => m.user.username === interaction.message.embeds[0].description.split(" ")[0].split("#")[0] && m.user.discriminator === interaction.message.embeds[0].description.split(" ")[0].split("#")[1]).user;
            try {await user.send(`Votre ticket a été supprimé par ${interaction.user.tag}`)} catch (err) {}
            await interaction.channel.delete()
        }
    }
})