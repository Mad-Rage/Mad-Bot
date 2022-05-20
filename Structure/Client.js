const Discord = require("discord.js");
const fs = require("fs")
const InviteTracker = require("@androz2091/discord-invites-tracker");
const intents = new Discord.Intents(32767);
const Command = require("./Command");
const Database = require("./Database");
const Event = require("./Event");
const InviteEvent = require("./InviteEvent");

class Client extends Discord.Client {

    constructor(options) {

        super({ intents });

        /**
         * @type {Discord.Collection<string, Command>}
        */

        this.commands = new Discord.Collection()
        this.cooldown = new Discord.Collection()
        this.alias = new Discord.Collection()
        this.snipe = new Map()
        this.db = Database;
        this.color = "#2f3136";
        this.tracker = InviteTracker.init(this, {
            fetchGuilds: true,
            fetchVanity: true,
            fetchAuditLogs: true,
        });
        this.function = {
            createID: require("../Fonctions/createID"),
            createCaptcha: require("../Fonctions/createCaptcha"),
            searchLinks: require("../Fonctions/searchLinks"),
            searchMentions: require("../Fonctions/searchMentions"),
            searchSpam: require("../Fonctions/searchSpam")
        }
    }

    async start(token) {

        fs.readdirSync("./Commandes").filter(file => file.endsWith(".js")).forEach(async f => {
      
            /**
             * @type {Command} 
            */

            let props = require(`../Commandes/${f}`);
            console.log(`${f} commande chargée avec succès !`);
            this.commands.set(props.name, props)
            if(props.alias.length !== 0) {
                props.alias.forEach(async a => {
                    this.alias.set(a, props)
                })
            }
        })

        fs.readdirSync("./Events/").filter(dir => dir !== "Invite").forEach(dirs => {
    
            fs.readdirSync(`./Events/${dirs}/`).filter(files => files.endsWith(".js")).forEach(async evt => {

                /**
                 * @type {Event}
                */

                const event = require(`../Events/${dirs}/${evt}`);
                console.log(`${event.event}.js événement chargé avec succès !`)
                this.on(event.event, event.run.bind(null, this));
            })
        });

        fs.readdirSync("./Events/").filter(dir => dir === "Invite").forEach(dirs => {
    
            fs.readdirSync(`./Events/${dirs}/`).filter(files => files.endsWith(".js")).forEach(async evt => {

                /**
                 * @type {InviteEvent}
                */

                const event = require(`../Events/${dirs}/${evt}`);
                console.log(`${event.event}.js événement chargé avec succès !`)
                this.tracker.on(event.event, event.run.bind(null, this));
            })
        });

        this.login(token)
    }
}

module.exports = Client;