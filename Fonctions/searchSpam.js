const UserMap = new Map();

module.exports = async message => {

    if(message.channel.id === "947877033353031691") return;

    if(UserMap.get(message.author.id)) {

        const UserData = UserMap.get(message.author.id)
        const { lastMessage, timer } = UserData
        let difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = UserData.msgCount;

        if(difference > 3000) {

            clearTimeout(timer);
            UserData.msgCount = 1;
            UserData.lastMessage = message;

            UserData.timer = setTimeout(() => {

                UserMap.delete(message.author.id)

            }, 360000)

            UserMap.set(message.author.id, UserData)
        
        } else {

            msgCount++;

            if(msgCount >= 5) {

                await message.channel.send(`Attention ${message.author}, vous envoyez trop de messages en peu de temps !`)

                const messages = [...(await message.channel.messages.fetch({
                    limit: 5,
                    before: message.id,
                })).filter(msg => msg.author.id === message.author.id).values()]

                await message.channel.bulkDelete(messages);
            
            } else {

                UserData.msgCount = msgCount;
                UserMap.set(message.author.id, UserData)
            }
        }

    } else {

        let fn = setTimeout(async () => {

            UserMap.delete(user.id)
        }, 360000)

        UserMap.set(message.author.id, {

            msgCount: 1,
            lastMessage: message,
            timer: fn
        })
    }
}