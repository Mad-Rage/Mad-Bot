const Discord = require("discord.js")
const Event = require("../../Structure/Event");
const SlashCommand = require("../../Structure/SlashCommand")

module.exports = new Event("ready", async bot => {

    const db = bot.db;

    await SlashCommand(bot);

    bot.user.setStatus("online")

    setTimeout(async () => {

        const activités = ["la v13 de discord.js", "le développement", "Mad Rage le youtubeur", `${bot.users.cache.size} utilisateurs`, `${bot.guilds.cache.size} serveurs`]
        const activities = activités[Math.floor(Math.random() * activités.length - 1)]

        bot.user.setActivity(activities, { type: "WATCHING"})

    }, 15000)

    console.log(`${bot.user.username} : En ligne sur ${bot.guilds.cache.size} serveur(s) !`)

    setInterval(async () => {

        db.query(`SELECT * FROM temp`, async (err, req) => {

            if(req.length < 1) return;

            for(let i = 0; i < req.length; i++) {

                if(Date.now() < parseInt(req[i].time)) return;

                if(req[i].sanctionID.startsWith("BAN")) {

                    try {

                        bot.guilds.cache.get(req[i].guildID).members.unban(req[i].userID)
                        db.query(`DELETE FROM temp WHERE sanctionID = '${req[i].sanctionID}'`)

                    } catch (err) {}
                }
            }
        })

    }, 1000)

    let Embed = new Discord.MessageEmbed()
    .setColor(bot.color)
    .setTitle("Rôles de notifications")
    .setThumbnail(bot.user.displayAvatarURL({dynamic: true}))
    .setDescription("Veuillez choisir les rôles de notifications que vous voulez dans le menu déroulant ci-dessous.")
    .setTimestamp()
    .setFooter({text: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL({dynamic: true})})

    const menu = new Discord.MessageActionRow().addComponents(new Discord.MessageSelectMenu()
    .setCustomId("menu")
    .setMaxValues(3)
    .setMinValues(0)
    .setPlaceholder("Nous attendons votre choix !")
    .addOptions([{label: "Giveaway", description: "Rôle de notification pour les giveaways", emoji: "🎉", value: "giveaway"}, {label: "Annonces", description: "Rôle de notification pour les annonces", emoji: "📢", value: "annonce"}, {label: "Partenariat", description: "Rôle de notification pour les partenariats", emoji: "🤝", value: "partenariat"}]))

    let channel = bot.channels.cache.get("909138826583216140")

    let msg = await channel.send({embeds: [Embed], components: [menu]})

    const filter = async() => true;
    const collector = msg.createMessageComponentCollector({filter})

    collector.on("collect", async menu => {

        let giveawayrole = channel.guild.roles.cache.get("909139346584633354")
        let annoncerole = channel.guild.roles.cache.get("909139325147570306")
        let partenariatrole = channel.guild.roles.cache.get("909139365299638362")

        for(let i = 0; i < menu.values.length; i++) {
            if(menu.values[i] === "giveaway") menu.member.roles.add(giveawayrole.id)
            if(menu.values[i] === "annonce") menu.member.roles.add(annoncerole.id)
            if(menu.values[i] === "partenariat") menu.member.roles.add(partenariatrole.id)
        }

        if(menu.member.roles.cache.has(annoncerole.id) && !menu.values.includes("annonce")) menu.member.roles.remove(annoncerole.id)
        if(menu.member.roles.cache.has(giveawayrole.id) && !menu.values.includes("giveaway")) menu.member.roles.remove(giveawayrole.id)
        if(menu.member.roles.cache.has(partenariatrole.id) && !menu.values.includes("partenariat")) menu.member.roles.remove(partenariatrole.id)

        menu.reply({content: "Vos rôles ont été modifiés !", ephemeral: true})
    })
})