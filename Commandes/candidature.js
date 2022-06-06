const Discord = require("discord.js")
const Command = require("../Structure/Command")

module.exports = new Command({

    name: "candidature",
    description: "Permet de faire une candidature de staff",
    utilisation: "",
    alias: ["candidature"],
    permission: "Aucune",
    category: "Staff",
    cooldown: 120,

    async run(bot, message, args, db) {

        if(message.author) return;

        let question1 = new Discord.MessageActionRow().addComponents(new Discord.TextInputComponent()
        .setCustomId("pseudo")
        .setLabel("Quel est ton pseudo ?")
        .setRequired(true)
        .setPlaceholder("Ecrire ici...")
        .setStyle("SHORT"))
        let question2 = new Discord.MessageActionRow().addComponents(new Discord.TextInputComponent()
        .setCustomId("experience")
        .setLabel("Quelle est ton expérience ?")
        .setRequired(true)
        .setPlaceholder("Ecrire ici...")
        .setStyle("PARAGRAPH"))
        let question3 = new Discord.MessageActionRow().addComponents(new Discord.TextInputComponent()
        .setCustomId("motivation")
        .setLabel("Quelle sont tes motivations ?")
        .setRequired(true)
        .setPlaceholder("Ecrire ici...")
        .setStyle("PARAGRAPH"))

        let Modal = new Discord.Modal()
        .setCustomId("candid")
        .setTitle("Candidature staff")
        .addComponents(question1, question2, question3)

        await message.showModal(Modal)

        try {

            let response = await message.awaitModalSubmit({time: 300000})

            let pseudo = response.fields.getTextInputValue("pseudo")
            let experience = response.fields.getTextInputValue("experience")
            let motivation = response.fields.getTextInputValue("motivation")

            await response.reply({content: "Votre candidature a été envoyée avec succès !", ephemeral: true})

            let Embed = new Discord.MessageEmbed()
            .setColor(bot.color)
            .setTitle(`Candidature de ${message.user.username}`)
            .addField("Pseudo", `${pseudo}`)
            .addField("experience", `${experience}`)
            .addField("Motivation", `${motivation}`)

            await bot.channels.cache.get("944932662345351168").send({embeds: [Embed]})

        } catch (err) {return;}
    }
})