/** @format */

const Discord = require("discord.js");
const mysql = require("mysql")
const Client = require("./Client");

/**
 * @param {Client} bot
 * @param {Discord.Message | Discord.CommandInteraction} message
 * @param {string[] | Discord.CommandInteractionOptionResolver} args
 * @param {mysql.Connection} db
*/

function RunFunction(bot, message, args, db) {}

class Command {

    /**
     * @typedef {{name: string, description: string, utilisation: string, alias: string[], permission: bigint, category: string, cooldown: number, run: RunFunction}} CommandOptions
     * @param {CommandOptions} options 
    */
    
    constructor(options) {

        this.name = options.name;
        this.description = options.description;
        this.utilisation = options.utilisation;
        this.alias = options.alias;
        this.permission = options.permission;
        this.category = options.category;
        this.cooldown = options.cooldown;
        this.run = options.run;
    }
}

module.exports = Command;