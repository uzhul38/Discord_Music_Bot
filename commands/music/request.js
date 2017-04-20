const Commando = require('discord.js-commando');
const Index = require('../../index');

var aliases = Index.aliases;

class RequestCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'request',
            group: 'music',
            memberName: 'request',
            description: 'Add the requested video to the playlist queue',
            args: [{
                key:'url',
                prompt: 'video URL, video ID, playlist URL or alias',
                type: 'string'
            }]
        });
    }

    async run(message, args){
        if (aliases.hasOwnProperty(params[1].toLowerCase())) {
            args[1] = aliases[args[1].toLowerCase()];
        }
        var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
        var match = args[1].match(regExp);

        if (match && match[2]){
            Index.queue_playlist(match[2], message);
        } else {
            Index.add_to_queue(params[1], message);
        }
    }
}

module.exports = RequestCommand;