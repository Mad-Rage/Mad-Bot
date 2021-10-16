module.exports = async (db, guild, bot) => {

    db.query(`SELECT * FROM serveur WHERE guildID = ${guild.id}`, async (err, req) => {

        if(req.length < 1 || req[0].rolemutedID === "Aucun" || !guild.roles.cache.get(req[0].rolemutedID)) {
            
            const role = await guild.roles.create({
                name: "Muted",
                color: "#757575",
                permissions: ["VIEW_CHANNEL"]
            })

            guild.channels.cache.forEach(channel => {

                channel.permissionOverwrites.create(role, {
                    SEND_MESSAGES: false,
                    CONNECT: false,
                    VIEW_CHANNEL: true,
                    SPEAK: false,
                    ADD_REACTIONS: false
                })
            })
        }
    })
}