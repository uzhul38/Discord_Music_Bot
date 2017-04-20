const Commando = require('discord.js-commando');
const Index = require('../../index');

var stopped = Index.stopped;
var voice_handler = Index.voice_handler;

class StopCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'stop',
            group: 'music',
            memberName: 'stop',
            description: 'Stops playlist (will also skip current song!)'
        });
    }

    async run(message, args){
        if (stopped) {
            message.channel.send('Playback is already stopped!');
        } else {
            stopped = true;
            if (voice_handler !==  null) {
                voice_handler.end()
            }
            message.channel.send('Stopping the music')
        }
    }
}

module.exports = StopCommand;