const Discord = require("discord.js")
const Event = require("../../Structure/Event")

module.exports = new Event("messageCreate", async (bot, message) => {

    if(message.author.bot) return;

    const db = bot.db;

    db.query(`SELECT * FROM serveur WHERE guildID = ${message.guild.id}`, async (err, req) => {

        if(req.length < 1) {

            let sql = `INSERT INTO serveur (guildID, prefix) VALUES (${message.guild.id}, '/')`
            db.query(sql, function(err) {
                if(err) throw err;
            })

            return message.reply("Attendez que le bot enregistre votre serveur !")
        }

        let prefix = req[0].prefix

        let messageArray = message.content.split(" ");
        let command = messageArray[0];
        let args = messageArray.slice(1);

        let commandFile = bot.commands.get(command.slice(prefix.length))

        db.query(`SELECT * FROM user WHERE userID = ${message.author.id}`, async (err, req) => {

            if(req.length < 1) {

                let sql = `INSERT INTO user (userID, xp, level) VALUES (${message.author.id}, '0', '0')`
                db.query(sql, function(err) {
                    if(err) throw err;
                })

            } else {

                if(!message.content.startsWith(prefix)) {

                    let xp = Math.floor(Math.random() * 24) + 1;
                    let need = (parseInt(req[0].level) + 1) * 1000;

                    db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) + xp}' WHERE userID = ${message.author.id}`)

                    if(parseInt(req[0].xp) >= need) {

                        db.query(`UPDATE user SET level = '${parseInt(req[0].level) + 1}' WHERE userID = ${message.author.id}`)
                        db.query(`UPDATE user SET xp = '${parseInt(req[0].xp) - need}' WHERE userID = ${message.author.id}`)

                        message.channel.send(`Bravo ${message.author}, tu es passé niveau \`${parseInt(req[0].level) + 1}\``)
                    }

                    if(parseInt(req[0].xp) < 0) {

                        db.query(`UPDATE user SET level = '${parseInt(req[0].level) - 1}' WHERE userID = ${message.author.id}`)
                        db.query(`UPDATE user SET xp = '${(parseInt(req[0].level) * 1000) + parseInt(req[0].xp)}' WHERE userID = ${message.author.id}`)

                        message.channel.send(`Dommage ${message.author}, tu es redescendu niveau \`${parseInt(req[0].level) - 1}\``)
                    }
                }
            }
        })

        if(!message.content.startsWith(prefix)) return;
        if(!commandFile) return message.reply(`Cette commande n'existe pas !`)

        if(commandFile.permission === "Développeur" && message.author.id !== "499974131572539392") return message.reply("Vous n'avez pas la permission requise pour exécuter cette commande !")
        if(commandFile.permission !== "Aucune" && commandFile.permission !== "Développeur" && !message.member.permissions.has(new Discord.Permissions(commandFile.permission))) return message.reply("Vous n'avez pas la permission requise pour exécuter cette commande !")

        commandFile.run(bot, message, args, db)
    })
})