const Commando = require('discord.js-commando');
const Index = require('../../index');

var now_playing_data = Index.now_playing_data;

class NpCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'np',
            group: 'music',
            memberName: 'np',
            description: 'Display the current song',
            parameters: []
        });
    }

    async run(message, args){
        var response = "Now playing: ";
        if(Index.is_bot_playing()) {
            response += "\"" + now_playing_data["title"] + "\" (requested by " + now_playing_data["user"] + ")";
        } else {
            response += "nothing!";
        }

        message.reply(response);
        }
}

module.exports = NpCommand;