const Commando = require('discord.js-commando');
const Index = require('../../index');

var voice_handler = Index.voice_handler;

class SkipCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'skip',
            group: 'music',
            memberName: 'skip',
            description: 'Skip the current song'
        });
    }

    async run(message, args){
			if(voice_handler !== null) {
				message.reply("Skipping...");
				voice_handler.end();
			} else {
				message.reply("There is nothing being played.");
			}
    }
}

module.exports = SkipCommand;