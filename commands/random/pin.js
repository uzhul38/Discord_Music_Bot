const Commando = require('discord.js-commando');

class PinCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'pin',
            group: 'random',
            memberName: 'pin',
            description: 'Pin Pon'
        });
    }

    async run(message, args){
        message.channel.sendMessage('Pon');
    }
}

module.exports = PinCommand;