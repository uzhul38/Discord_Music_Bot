const Commando = require('discord.js-commando');
const Index = require('../../index');

var queue = Index.queue;

class QueueCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'queue',
            group: 'music',
            memberName: 'queue',
            description: 'Displays the queue'
        });
    }

    async run(message, args){
        var response = "";

        if(Index.is_queue_empty()) {
            response = "the queue is empty.";
        } else {
            var long_queue = queue.length > 30;
            for(var i = 0; i < (long_queue ? 30 : queue.length); i++) {
                response += "\"" + queue[i]["title"] + "\" (requested by " + queue[i]["user"] + ")\n";
            }

            if(long_queue) response += "\n**...and " + (queue.length - 30) + " more.**";
        }
        
        message.reply(response);
    }
}

module.exports = QueueCommand;