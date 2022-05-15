/** @format */

const Invite = require("@androz2091/discord-invites-tracker");
const Client = require("./Client");

/**
 * @template {keyof Invite.InviteEvents} K
 * @param {Client} bot 
 * @param  {Invite.InviteEvents[K]} eventArgs 
*/

function RunFunction(bot, ...eventArgs) {}

/**
 * @template {keyof Invite.InviteEvents} K
*/

class InviteEvent {

    /**
     * @param {K} event 
     * @param {RunFunction<K>} runFunction 
    */

    constructor(event, runFunction) {

        this.event = event;
        this.run = runFunction;
    }
}

module.exports = InviteEvent;