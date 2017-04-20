const Commando = require('discord.js-commando');
const Index = require('../../index');

var queue = Index.queue;

class RemoveCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'remove',
            group: 'music',
            memberName: 'remove',
            description: 'Removes a song from the queue',
            parameters: [{
                prompt: 'Request index or \'last\'',
                type: 'string'
            }]
        });
    }

    async run(message, args){
			var index = args[1];

			if(Index.is_queue_empty()) {
				message.reply("The queue is empty");
				return;
			} else if(isNaN(index) && index !== "last") {
				message.reply("Argument '" + index + "' is not a valid index.");
				return;
			}

			if(index === "last") { index = queue.length; }
			index = parseInt(index);
			if(index < 1 || index > queue.length) {
				message.reply("Cannot remove request #" + index + " from the queue (there are only " + queue.length + " requests currently)");
				return;
			}

			var deleted = queue.splice(index - 1, 1);
			message.reply('Request "' + deleted[0].title +'" was removed from the queue.');
    }
}

module.exports = RemoveCommand;