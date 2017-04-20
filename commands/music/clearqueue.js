const Commando = require('discord.js-commando');
const Index = require('../../index');

var queue = Index.queue;

class ClearQueueCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'clearqueue',
            group: 'music',
            memberName: 'clearqueue',
            description: 'Removes all songs from the queue'
        });
    }

    async run(message, args){
			queue = [];
			message.reply("Queue has been cleared!");
    }
}

module.exports = ClearQueueCommand;