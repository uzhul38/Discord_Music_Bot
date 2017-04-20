const Commando = require('discord.js-commando');
const Index = require('../../index');

var stopped = Index.stopped;

class ResumeCommand extends Commando.Command {
    constructor(client){
        super(client, {
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Resume the music'
        });
    }

    async run(message, args){
        if (stopped) {
            stopped = false;
            if(!is_queue_empty()){
                play_next_song();
            }
        } else {
            message.channel.send('The music is already playing !')
        }
    }
}

module.exports = ResumeCommand;