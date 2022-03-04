const Discord = require("discord.js")
const Canvas = require("canvas")
const Event = require("../../Structure/Event")

module.exports = new Event("guildMemberAdd", async (bot, member) => {

    const db = bot.db;

    db.query(`SELECT * FROM serveur WHERE guildID = ${member.guild.id}`, async (err, req) => {

        if(req.length < 1) return;

        if(req[0].raid === "on") {

            try {
                await member.user.send("Ce serveur est en mode anti-raid !")
            } catch (err) {}

            await member.kick("Mode anti-raid activé")
        }

        if(req[0].captcha === "on") {

            let text = await bot.function.createCaptcha();

            Canvas.registerFont("./node_modules/discord-canvas-easy/Assets/futura-bold.ttf", { family: "Futura Book"})
            
            const canvas = Canvas.createCanvas(300, 150)
            const ctx = canvas.getContext("2d");

            ctx.font = '35px "Futura Book"';
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, (150 - (ctx.measureText(`${text}`).width) / 2), 85)

            const btn = new Discord.MessageActionRow().addComponents(new Discord.MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("valided")
            .setLabel("Valider")
            .setEmoji("✅"))

            let msg = await bot.channels.cache.get("947877033353031691").send({files: [await canvas.toBuffer()], components: [btn]})

            let finalmessage;
            let valided = false;
            const filter = m => m.author.id === member.user.id;
            const collectorm = msg.channel.createMessageCollector({filter, time: 120000})
            const filter2 = async() => true;
            const collectorb = msg.createMessageComponentCollector({filter2, time: 120000})

            collectorm.on("collect", async message => {

                finalmessage = message.content;
            })

            collectorb.on("collect", async button => {

                if(button.user.id !== member.user.id) return button.reply({content: "Vous n'êtes pas l'auteur du message !", ephemeral: true})

                if(finalmessage === text) {

                    valided = true;
                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        await member.user.send("Captcha réussi !")
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())

                } else {

                    valided = true;
                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        await member.user.send("Captcha raté !")
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())
                    await member.kick()
                }
            })

            collectorm.on("end", async () => {

                if(valided === false) {

                    await collectorb.stop()
                    await collectorm.stop()
                    try {
                        await member.user.send("Captcha raté !")
                    } catch (err) {}
                    [...(await msg.channel.messages.fetch()).values()].filter(m => m.author.id === member.user.id || m.author.id === bot.user.id).forEach(async m => m.delete())
                    await member.kick()
                }
            })
        }
    })
})