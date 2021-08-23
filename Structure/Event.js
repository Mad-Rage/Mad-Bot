/** @format */

const Discord = require("discord.js");
const Client = require("./Client");

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Client} bot 
 * @param  {Discord.ClientEvents[K]} eventArgs 
*/

function RunFunction(bot, ...eventArgs) {}

/**
 * @template {keyof Discord.ClientEvents} K
*/

class Event {

    /**
     * @param {K} event 
     * @param {RunFunction<K>} runFunction 
    */

    constructor(event, runFunction) {

        this.event = event;
        this.run = runFunction;
    }
}

module.exports = Event;