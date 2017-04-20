const Commando = require('discord.js-commando');

class DiceRollCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Loterie'
        });
    }

    async run(message, args){
        var roll = Math.floor(Math.random() *6) + 1;
        message.reply("Vous etes tombe sur un " + roll);
    }
}

module.exports = DiceRollCommand;