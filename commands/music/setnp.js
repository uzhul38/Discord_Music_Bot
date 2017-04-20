const Commando = require('discord.js-commando');
const Index = require('../../index');

var inform_np = Index.inform_np;

class SetNpCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'setnp',
            group: 'music',
            memberName: 'setnp',
            description: 'Sets whether the bot will announce the current song or not',
            args: [{
                key: 'string',
                prompt: 'on/off',
                type: 'string'
            }]
        });
    }

    async run(message, args){
        if(args[1].toLowerCase() == "on") {
            var response = "Will announce song names in chat";
            inform_np = true;
        } else if(args[1].toLowerCase() == "off") {
            var response = "Will no longer announce song names in chat";
            inform_np = false;
        } else {
            var response = "Sorry?";
        }
        
        message.reply(response);
    }
}

module.exports = SetNpCommand;